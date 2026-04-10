import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('account')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  /** POST /fundz/account/ */
  @Post()
  create(@Body() dto: CreateAccountDto, @CurrentUser() userId: string) {
    return this.accountsService.create(dto, userId);
  }

  /** GET /fundz/account/ */
  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.accountsService.findAll(userId);
  }

  /** GET /fundz/account/balance/:id */
  @Get('balance/:id')
  getBalance(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.accountsService.getBalance(id, userId);
  }

  /** GET /fundz/account/:id */
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  /** PUT /fundz/account/ — ID comes in the body (Go parity). */
  @Put()
  update(@Body() dto: UpdateAccountDto, @CurrentUser() userId: string) {
    return this.accountsService.update(dto, userId);
  }

  /** DELETE /fundz/account/:id */
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.accountsService.remove(id, userId);
  }
}
