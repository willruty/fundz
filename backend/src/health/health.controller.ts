import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller()
export class HealthController {
  /** GET /fundz/health — corrected spelling. */
  @Public()
  @Get('health')
  getHealth() {
    return { data: { status: 'ok' } };
  }
}
