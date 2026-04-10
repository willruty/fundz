import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** POST /fundz/user/auth/register */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  /** POST /fundz/user/auth/login */
  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  /** GET /fundz/user/auth/validate (protected) */
  @Get('validate')
  validate(@CurrentUser() userId: string) {
    return this.usersService.validate(userId);
  }
}
