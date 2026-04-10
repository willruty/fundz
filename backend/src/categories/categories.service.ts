import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto, userId: string) {
    const category = await this.prisma.category.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
      },
    });
    return { data: category };
  }

  async findAll(userId: string) {
    const [results, count] = await Promise.all([
      this.prisma.category.findMany({ where: { userId } }),
      this.prisma.category.count({ where: { userId } }),
    ]);

    return {
      results,
      RowsAffected: count,
      RecordCount: results.length,
    };
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('categoria não encontrada');
    }

    return { data: category };
  }

  async update(dto: UpdateCategoryDto, userId: string) {
    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.type !== undefined) data.type = dto.type;

    const result = await this.prisma.category.updateMany({
      where: { id: dto.id, userId },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundException('categoria não encontrada');
    }

    return { data: { id: dto.id, ...data } };
  }

  async remove(id: string, userId: string) {
    const result = await this.prisma.category.deleteMany({
      where: { id, userId },
    });

    if (result.count === 0) {
      throw new NotFoundException('categoria não encontrada');
    }

    return { data: 'categoria removida' };
  }
}
