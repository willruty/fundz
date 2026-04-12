import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';

@Injectable()
export class InstallmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInstallmentDto, userId: string) {
    const installment = await this.prisma.installment.create({
      data: {
        userId,
        name: dto.name,
        totalAmount: dto.total_amount,
        installmentAmount: dto.installment_amount,
        totalInstallments: dto.total_installments,
        paidInstallments: dto.paid_installments ?? 0,
        startDate: new Date(dto.start_date),
        billingDay: dto.billing_day,
        accountId: dto.account_id ?? null,
        categoryId: dto.category_id ?? null,
        active: dto.active ?? true,
      },
    });
    return { data: installment };
  }

  async findAll(userId: string) {
    const [results, count] = await Promise.all([
      this.prisma.installment.findMany({ where: { userId } }),
      this.prisma.installment.count({ where: { userId } }),
    ]);

    return {
      results,
      RowsAffected: count,
      RecordCount: results.length,
    };
  }

  async findOne(id: string, userId: string) {
    const installment = await this.prisma.installment.findFirst({
      where: { id, userId },
    });

    if (!installment) {
      throw new NotFoundException('parcelamento não encontrado');
    }

    return { data: installment };
  }

  async update(dto: UpdateInstallmentDto, userId: string) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.total_amount !== undefined) data.totalAmount = dto.total_amount;
    if (dto.installment_amount !== undefined) data.installmentAmount = dto.installment_amount;
    if (dto.total_installments !== undefined) data.totalInstallments = dto.total_installments;
    if (dto.paid_installments !== undefined) data.paidInstallments = dto.paid_installments;
    if (dto.start_date !== undefined) data.startDate = new Date(dto.start_date);
    if (dto.billing_day !== undefined) data.billingDay = dto.billing_day;
    if (dto.account_id !== undefined) data.accountId = dto.account_id;
    if (dto.category_id !== undefined) data.categoryId = dto.category_id;
    if (dto.active !== undefined) data.active = dto.active;

    const result = await this.prisma.installment.updateMany({
      where: { id: dto.id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('parcelamento não encontrado');
    }

    return { data: { id: dto.id, ...data } };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.installment.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('parcelamento não encontrado');
    }

    return { data: 'parcelamento removido' };
  }
}
