import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** POST /fundz/user/auth/register */
  @Public()
  @Post('auth/register')
  register(@Body() dto: RegisterDto) {
    return this.usersService.register(dto);
  }

  /** POST /fundz/user/auth/login */
  @Public()
  @Post('auth/login')
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }

  /** GET /fundz/user/auth/validate (protected) */
  @Get('auth/validate')
  validate(@CurrentUser() userId: string) {
    return this.usersService.validate(userId);
  }

  /** GET /fundz/user/profile */
  @Get('profile')
  getProfile(@CurrentUser() userId: string) {
    return this.usersService.getProfile(userId);
  }

  /** PUT /fundz/user/profile */
  @Put('profile')
  updateProfile(@CurrentUser() userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  /** PUT /fundz/user/password */
  @Put('password')
  changePassword(@CurrentUser() userId: string, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(userId, dto);
  }

  /** DELETE /fundz/user/account */
  @Delete('account')
  deleteAccount(@CurrentUser() userId: string) {
    return this.usersService.deleteAccount(userId);
  }
}
