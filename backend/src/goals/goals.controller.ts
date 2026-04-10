import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Controller('goal')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body() dto: CreateGoalDto, @CurrentUser() userId: string) {
    return this.goalsService.create(dto, userId);
  }

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.goalsService.findOne(id, userId);
  }

  @Put()
  update(@Body() dto: UpdateGoalDto, @CurrentUser() userId: string) {
    return this.goalsService.update(dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.goalsService.remove(id, userId);
  }
}
