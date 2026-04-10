import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTransactionDto, userId: string) {
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        accountId: dto.account_id,
        categoryId: dto.category_id ?? null,
        amount: dto.amount,
        type: dto.type,
        description: dto.description ?? null,
        occurredAt: dto.occurred_at ? new Date(dto.occurred_at) : new Date(),
      },
    });
    return { data: transaction };
  }

  async findAll(userId: string) {
    const [results, count] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        orderBy: { occurredAt: 'desc' },
      }),
      this.prisma.transaction.count({ where: { userId } }),
    ]);

    return {
      results,
      RowsAffected: count,
      RecordCount: results.length,
    };
  }

  /**
   * GET /fundz/transaction/last-month
   *
   * Returns a RAW ARRAY (no envelope) — this is the documented exception.
   * Shape: [{ date, value, type }, ...]
   *
   * Replicates TransactionService.GetLastMonthTransactions from Go:
   *   WHERE occurred_at >= now() - 30 days, ORDER BY occurred_at ASC.
   */
  async getLastMonth(userId: string) {
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

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
    });

    if (!transaction) {
      throw new NotFoundException('transação não encontrada');
    }

    return { data: transaction };
  }

  async update(dto: UpdateTransactionDto, userId: string) {
    const data: Record<string, unknown> = {};
    if (dto.account_id !== undefined) data.accountId = dto.account_id;
    if (dto.category_id !== undefined) data.categoryId = dto.category_id;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.occurred_at !== undefined) data.occurredAt = new Date(dto.occurred_at);

    const result = await this.prisma.transaction.updateMany({
      where: { id: dto.id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('transação não encontrada');
    }

    return { data: { id: dto.id, ...data } };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.transaction.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('transação não encontrada');
    }

    return { data: 'transação removida' };
  }
}
