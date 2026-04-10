import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSubscriptionDto, userId: string) {
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        name: dto.name,
        amount: dto.amount,
        billingCycle: dto.billing_cycle,
        accountId: dto.account_id ?? null,
        categoryId: dto.category_id ?? null,
        nextBillingDate: dto.next_billing_date ? new Date(dto.next_billing_date) : null,
        active: dto.active ?? true,
      },
    });
    return { data: subscription };
  }

  async findAll(userId: string) {
    const [results, count] = await Promise.all([
      this.prisma.subscription.findMany({ where: { userId } }),
      this.prisma.subscription.count({ where: { userId } }),
    ]);

    return {
      results,
      RowsAffected: count,
      RecordCount: results.length,
    };
  }

  async findOne(id: string, userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id, userId },
    });

    if (!subscription) {
      throw new NotFoundException('assinatura não encontrada');
    }

    return { data: subscription };
  }

  async update(dto: UpdateSubscriptionDto, userId: string) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.billing_cycle !== undefined) data.billingCycle = dto.billing_cycle;
    if (dto.account_id !== undefined) data.accountId = dto.account_id;
    if (dto.category_id !== undefined) data.categoryId = dto.category_id;
    if (dto.next_billing_date !== undefined) data.nextBillingDate = new Date(dto.next_billing_date);
    if (dto.active !== undefined) data.active = dto.active;

    const result = await this.prisma.subscription.updateMany({
      where: { id: dto.id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('assinatura não encontrada');
    }

    return { data: { id: dto.id, ...data } };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.subscription.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('assinatura não encontrada');
    }

    return { data: 'assinatura removida' };
  }
}
