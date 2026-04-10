import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
import { PrismaService } from '../prisma/prisma.service';

export interface AccountSummary {
  name: string;
  balance: Decimal | Prisma.Decimal | null;
}

export interface TransactionSummary {
  date: Date;
  value: Decimal | Prisma.Decimal;
  type: string;
}

export interface GoalSummary {
  name: string;
  target: Decimal | Prisma.Decimal;
  current: Decimal | Prisma.Decimal;
  date: Date | null;
  percentage: Decimal | Prisma.Decimal;
}

export interface CategoryMostUsed {
  name: string;
  amount: Decimal | Prisma.Decimal;
}

export interface CategoryDistribution {
  name: string;
  amount: Decimal | Prisma.Decimal;
  percentage: Decimal | Prisma.Decimal;
}

export interface CategorySummary {
  most_used: CategoryMostUsed;
  distribution: CategoryDistribution[];
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [accounts, goal, lastMonthTransactions, categories] = await Promise.all([
      this.getAccountsSummary(userId),
      this.getNextGoal(userId),
      this.getLastMonthTransactions(userId),
      this.getCategorySummary(userId),
    ]);

    return {
      data: {
        accounts,
        goal,
        last_month_transactions: lastMonthTransactions,
        categories,
      },
    };
  }

  private async getAccountsSummary(userId: string): Promise<AccountSummary[]> {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { name: true, balance: true },
    });

    return accounts.map((a) => ({ name: a.name, balance: a.balance }));
  }

  /**
   * Next uncompleted goal: current_amount < target_amount, ordered by due_date ASC.
   * If none found or target is zero, returns a zeroed-out DTO (no error).
   */
  private async getNextGoal(userId: string): Promise<GoalSummary> {
    const emptyGoal: GoalSummary = {
      name: '',
      target: new Decimal(0),
      current: new Decimal(0),
      date: null,
      percentage: new Decimal(0),
    };

    // Prisma can't do column-to-column comparison in `where`, so we use $queryRaw.
    const goals = await this.prisma.$queryRaw<
      Array<{
        name: string;
        target_amount: Prisma.Decimal;
        current_amount: Prisma.Decimal;
        due_date: Date | null;
      }>
    >(
      Prisma.sql`
        SELECT name, target_amount, current_amount, due_date
        FROM goals
        WHERE user_id = ${userId}::uuid
          AND current_amount < target_amount
        ORDER BY due_date ASC
        LIMIT 1
      `,
    );

    if (goals.length === 0) {
      return emptyGoal;
    }

    const g = goals[0];
    const target = new Decimal(g.target_amount.toString());
    const current = new Decimal(g.current_amount.toString());

    if (target.isZero()) {
      return emptyGoal;
    }

    const percentage = current.div(target).mul(100).toDecimalPlaces(2);

    return {
      name: g.name,
      target,
      current,
      date: g.due_date,
      percentage,
    };
  }

  /** Last 30 days of transactions, ordered by occurred_at ASC. */
  private async getLastMonthTransactions(userId: string): Promise<TransactionSummary[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        occurredAt: { gte: thirtyDaysAgo },
      },
      orderBy: { occurredAt: 'asc' },
    });

    return transactions.map((tx) => ({
      date: tx.occurredAt,
      value: tx.amount,
      type: tx.type,
    }));
  }

  private async getCategorySummary(userId: string): Promise<CategorySummary> {
    const [mostUsedRows, distributionRows] = await Promise.all([
      this.prisma.$queryRaw<Array<{ name: string; amount: Prisma.Decimal }>>(
        Prisma.sql`
          SELECT c.name, SUM(ABS(t.amount)) AS amount
          FROM transactions t
          JOIN categories c ON c.id = t.category_id
          WHERE t.user_id = ${userId}::uuid
          GROUP BY c.name
          ORDER BY amount DESC
          LIMIT 1
        `,
      ),
      this.prisma.$queryRaw<Array<{ name: string; amount: Prisma.Decimal }>>(
        Prisma.sql`
          SELECT c.name, SUM(t.amount) AS amount
          FROM transactions t
          JOIN categories c ON c.id = t.category_id
          WHERE t.user_id = ${userId}::uuid
          GROUP BY c.name
          ORDER BY amount DESC
        `,
      ),
    ]);

    const mostUsed: CategoryMostUsed =
      mostUsedRows.length > 0
        ? { name: mostUsedRows[0].name, amount: new Decimal(mostUsedRows[0].amount.toString()) }
        : { name: '', amount: new Decimal(0) };

    // Calculate percentage for each category in distribution.
    let total = new Decimal(0);
    for (const row of distributionRows) {
      total = total.add(new Decimal(row.amount.toString()));
    }

    const distribution: CategoryDistribution[] = total.isZero()
      ? []
      : distributionRows.map((row) => {
          const amount = new Decimal(row.amount.toString());
          return {
            name: row.name,
            amount,
            percentage: amount.div(total).mul(100).toDecimalPlaces(2),
          };
        });

    return { most_used: mostUsed, distribution };
  }
}
