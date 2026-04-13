import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAccountDto, userId: string) {
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        ...(dto.balance !== undefined && { balance: dto.balance }),
      },
    });
  }

  async findAll(userId: string) {
    const [results, count] = await Promise.all([
      this.prisma.account.findMany({ where: { userId } }),
      this.prisma.account.count({ where: { userId } }),
    ]);

    return {
      results,
      RowsAffected: count,
      RecordCount: results.length,
    };
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('conta não encontrada');
    }

    return { data: account };
  }

  async getBalance(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
      select: { balance: true },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    return { current_balance: account.balance };
  }

  async update(dto: UpdateAccountDto, userId: string) {
    // Replicate GORM Updates() — only set fields that are present in the DTO.
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.type !== undefined) data.type = dto.type;
    if (dto.balance !== undefined) data.balance = dto.balance;

    const result = await this.prisma.account.updateMany({
      where: { id: dto.id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('conta não encontrada');
    }

    return { data: { id: dto.id, ...data } };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.account.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('conta não encontrada');
    }

    return { data: 'conta removida' };
  }
}
