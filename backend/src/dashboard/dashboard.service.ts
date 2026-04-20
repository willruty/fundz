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

export type HealthLevel = 'bom' | 'atenção' | 'crítico' | 'moderado' | 'alto' | 'baixo' | 'ruim' | 'sem dados';

export interface FinancialHealthIndicator {
  label: string;
  level: HealthLevel;
  value: string;
}

export interface FinancialHealth {
  gastos: FinancialHealthIndicator;
  dividas: FinancialHealthIndicator;
  investimentos: FinancialHealthIndicator;
}

export interface SubscriptionSummary {
  name: string;
  category: string;
  monthlyAmount: string;
  billingCycle: string;
  nextBillingDate: string | null;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(userId: string) {
    const [accounts, goal, lastMonthTransactions, categories, financialHealth, subscriptions] = await Promise.all([
      this.getAccountsSummary(userId),
      this.getNextGoal(userId),
      this.getLastMonthTransactions(userId),
      this.getCategorySummary(userId),
      this.getFinancialHealth(userId),
      this.getSubscriptionsSummary(userId),
    ]);

    return {
      data: {
        accounts,
        goal,
        last_month_transactions: lastMonthTransactions,
        categories,
        financial_health: financialHealth,
        subscriptions,
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

  private async getSubscriptionsSummary(userId: string): Promise<SubscriptionSummary[]> {
    const subs = await this.prisma.subscription.findMany({
      where: { userId, active: true },
      select: {
        name: true,
        amount: true,
        billingCycle: true,
        nextBillingDate: true,
        category: { select: { name: true } },
      },
      orderBy: { nextBillingDate: 'asc' },
    });

    return subs.map((s) => ({
      name: s.name,
      category: s.category?.name ?? '',
      monthlyAmount:
        s.billingCycle === 'yearly'
          ? new Decimal(s.amount.toString()).div(12).toDecimalPlaces(2).toString()
          : s.amount.toString(),
      billingCycle: s.billingCycle,
      nextBillingDate: s.nextBillingDate?.toISOString() ?? null,
    }));
  }

  private async getFinancialHealth(userId: string): Promise<FinancialHealth> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [transactionTotals, subscriptionTotal, installmentTotal] = await Promise.all([
      // Income and expense totals from last 30 days
      this.prisma.$queryRaw<Array<{ type: string; total: Prisma.Decimal }>>(
        Prisma.sql`
          SELECT type, SUM(ABS(amount)) AS total
          FROM transactions
          WHERE user_id = ${userId}::uuid
            AND occurred_at >= ${thirtyDaysAgo}
          GROUP BY type
        `,
      ),
      // Monthly cost of active subscriptions
      this.prisma.$queryRaw<Array<{ total: Prisma.Decimal }>>(
        Prisma.sql`
          SELECT COALESCE(SUM(
            CASE WHEN billing_cycle = 'yearly' THEN amount / 12
                 ELSE amount
            END
          ), 0) AS total
          FROM subscriptions
          WHERE user_id = ${userId}::uuid AND active = true
        `,
      ),
      // Monthly cost of active installments
      this.prisma.$queryRaw<Array<{ total: Prisma.Decimal }>>(
        Prisma.sql`
          SELECT COALESCE(SUM(installment_amount), 0) AS total
          FROM installments
          WHERE user_id = ${userId}::uuid
            AND active = true
            AND paid_installments < total_installments
        `,
      ),
    ]);

    let income = new Decimal(0);
    let expense = new Decimal(0);
    for (const row of transactionTotals) {
      if (row.type === 'income') income = new Decimal(row.total.toString());
      if (row.type === 'expense') expense = new Decimal(row.total.toString());
    }

    const monthlyDebts = new Decimal(subscriptionTotal[0]?.total?.toString() ?? '0')
      .add(new Decimal(installmentTotal[0]?.total?.toString() ?? '0'));

    // --- Gastos: expense/income ratio ---
    let gastos: FinancialHealthIndicator;
    if (income.isZero()) {
      gastos = { label: 'Gastos', level: 'sem dados', value: '0%' };
    } else {
      const ratio = expense.div(income).mul(100).toDecimalPlaces(0);
      const ratioNum = ratio.toNumber();
      let level: HealthLevel = 'bom';
      if (ratioNum > 85) level = 'crítico';
      else if (ratioNum > 60) level = 'atenção';
      gastos = { label: 'Gastos', level, value: `${ratioNum}%` };
    }

    // --- Dívidas: monthly debts / income ---
    let dividas: FinancialHealthIndicator;
    if (income.isZero() && monthlyDebts.isZero()) {
      dividas = { label: 'Dívidas', level: 'sem dados', value: 'R$ 0' };
    } else if (income.isZero()) {
      dividas = { label: 'Dívidas', level: 'alto', value: `R$ ${monthlyDebts.toFixed(0)}` };
    } else {
      const debtRatio = monthlyDebts.div(income).mul(100).toDecimalPlaces(0).toNumber();
      let level: HealthLevel = 'baixo';
      if (debtRatio > 50) level = 'alto';
      else if (debtRatio > 25) level = 'moderado';
      dividas = { label: 'Dívidas', level, value: `${debtRatio}%` };
    }

    // --- Investimentos: savings rate ---
    let investimentos: FinancialHealthIndicator;
    if (income.isZero()) {
      investimentos = { label: 'Investimentos', level: 'sem dados', value: '0%' };
    } else {
      const savingsRate = income.sub(expense).div(income).mul(100).toDecimalPlaces(0);
      const savingsNum = savingsRate.toNumber();
      let level: HealthLevel = 'bom';
      if (savingsNum < 5) level = 'ruim';
      else if (savingsNum < 20) level = 'atenção';
      investimentos = { label: 'Investimentos', level, value: `${savingsNum}%` };
    }

    return { gastos, dividas, investimentos };
  }
}
