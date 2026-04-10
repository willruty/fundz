import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @CurrentUser() userId: string) {
    return this.transactionsService.create(dto, userId);
  }

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.transactionsService.findAll(userId);
  }

  /** GET /fundz/transaction/last-month — raw array, no envelope. */
  @Get('last-month')
  getLastMonth(@CurrentUser() userId: string) {
    return this.transactionsService.getLastMonth(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.transactionsService.findOne(id, userId);
  }

  @Put()
  update(@Body() dto: UpdateTransactionDto, @CurrentUser() userId: string) {
    return this.transactionsService.update(dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.transactionsService.remove(id, userId);
  }
}
