import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ReadOnlyGuard } from './common/guards/read-only.guard';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { GoalsModule } from './goals/goals.module';
import { InstallmentsModule } from './installments/installments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InvestmentsModule } from './investments/investments.module';
import { UsersModule } from './users/users.module';
import { HttpExceptionResponseFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnv,
    }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    HealthModule,
    AccountsModule,
    CategoriesModule,
    GoalsModule,
    InstallmentsModule,
    SubscriptionsModule,
    TransactionsModule,
    DashboardModule,
    InvestmentsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionResponseFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ReadOnlyGuard,
    },
  ],
})
export class AppModule {}
