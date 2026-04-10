import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGoalDto, userId: string) {
    const goal = await this.prisma.goal.create({
      data: {
        userId,
        name: dto.name,
        targetAmount: dto.target_amount,
        currentAmount: dto.current_amount ?? 0,
        dueDate: dto.due_date ? new Date(dto.due_date) : null,
      },
    });
    return { data: goal };
  }

  async findAll(userId: string) {
    const [results, count] = await Promise.all([
      this.prisma.goal.findMany({ where: { userId } }),
      this.prisma.goal.count({ where: { userId } }),
    ]);

    return {
      results,
      RowsAffected: count,
      RecordCount: results.length,
    };
  }

  async findOne(id: string, userId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      throw new NotFoundException('meta não encontrada');
    }

    return { data: goal };
  }

  async update(dto: UpdateGoalDto, userId: string) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.target_amount !== undefined) data.targetAmount = dto.target_amount;
    if (dto.current_amount !== undefined) data.currentAmount = dto.current_amount;
    if (dto.due_date !== undefined) data.dueDate = new Date(dto.due_date);

    const result = await this.prisma.goal.updateMany({
      where: { id: dto.id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('meta não encontrada');
    }

    return { data: { id: dto.id, ...data } };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.goal.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('meta não encontrada');
    }

    return { data: 'meta removida' };
  }
}
