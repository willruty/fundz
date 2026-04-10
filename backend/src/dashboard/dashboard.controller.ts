import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** GET /fundz/dashboard/overview */
  @Get('overview')
  getOverview(@CurrentUser() userId: string) {
    return this.dashboardService.getOverview(userId);
  }
}
