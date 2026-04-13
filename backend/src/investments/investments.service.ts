import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Injectable()
export class InvestmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvestmentDto, userId: string) {
    return this.prisma.investment.create({
      data: {
        userId,
        name: dto.name,
        category: dto.category,
        amount: dto.amount,
        annualRate: dto.annualRate,
        ...(dto.startDate && { startDate: new Date(dto.startDate) }),
        ...(dto.notes && { notes: dto.notes }),
      },
    });
  }

  async findAll(userId: string) {
    const [results, count] = await Promise.all([
      this.prisma.investment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.investment.count({ where: { userId } }),
    ]);

    return { results, RowsAffected: count, RecordCount: results.length };
  }

  async findOne(id: string, userId: string) {
    const investment = await this.prisma.investment.findFirst({
      where: { id, userId },
    });

    if (!investment) throw new NotFoundException('investimento não encontrado');

    return { data: investment };
  }

  async update(dto: UpdateInvestmentDto, userId: string) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined)       data.name = dto.name;
    if (dto.category !== undefined)   data.category = dto.category;
    if (dto.amount !== undefined)     data.amount = dto.amount;
    if (dto.annualRate !== undefined) data.annualRate = dto.annualRate;
    if (dto.startDate !== undefined)  data.startDate = new Date(dto.startDate);
    if (dto.notes !== undefined)      data.notes = dto.notes;

    const result = await this.prisma.investment.updateMany({
      where: { id: dto.id, userId },
      data,
    });

    if (result.count === 0) throw new NotFoundException('investimento não encontrado');

    return { data: { id: dto.id, ...data } };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.investment.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) throw new NotFoundException('investimento não encontrado');

    return { data: 'investimento removido' };
  }
}
