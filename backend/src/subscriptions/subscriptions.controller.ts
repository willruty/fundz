import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscription')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  create(@Body() dto: CreateSubscriptionDto, @CurrentUser() userId: string) {
    return this.subscriptionsService.create(dto, userId);
  }

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.subscriptionsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.subscriptionsService.findOne(id, userId);
  }

  @Put()
  update(@Body() dto: UpdateSubscriptionDto, @CurrentUser() userId: string) {
    return this.subscriptionsService.update(dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.subscriptionsService.remove(id, userId);
  }
}
