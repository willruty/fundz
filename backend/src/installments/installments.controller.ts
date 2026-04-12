import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InstallmentsService } from './installments.service';
import { CreateInstallmentDto } from './dto/create-installment.dto';
import { UpdateInstallmentDto } from './dto/update-installment.dto';

@Controller('installment')
export class InstallmentsController {
  constructor(private readonly installmentsService: InstallmentsService) {}

  @Post()
  create(@Body() dto: CreateInstallmentDto, @CurrentUser() userId: string) {
    return this.installmentsService.create(dto, userId);
  }

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.installmentsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.installmentsService.findOne(id, userId);
  }

  @Put()
  update(@Body() dto: UpdateInstallmentDto, @CurrentUser() userId: string) {
    return this.installmentsService.update(dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.installmentsService.remove(id, userId);
  }
}
