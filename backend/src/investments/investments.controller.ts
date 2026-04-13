import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InvestmentsService } from './investments.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Controller('investment')
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  /** POST /fundz/investment/ */
  @Post()
  create(@Body() dto: CreateInvestmentDto, @CurrentUser() userId: string) {
    return this.investmentsService.create(dto, userId);
  }

  /** GET /fundz/investment/ */
  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.investmentsService.findAll(userId);
  }

  /** GET /fundz/investment/:id */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.investmentsService.findOne(id, userId);
  }

  /** PUT /fundz/investment/ — ID in body */
  @Put()
  update(@Body() dto: UpdateInvestmentDto, @CurrentUser() userId: string) {
    return this.investmentsService.update(dto, userId);
  }

  /** DELETE /fundz/investment/:id */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.investmentsService.remove(id, userId);
  }
}
