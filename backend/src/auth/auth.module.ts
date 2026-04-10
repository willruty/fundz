import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { SupabaseStrategy } from './strategies/supabase.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'supabase' })],
  providers: [
    SupabaseStrategy,
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
  exports: [PassportModule],
})
export class AuthModule {}
