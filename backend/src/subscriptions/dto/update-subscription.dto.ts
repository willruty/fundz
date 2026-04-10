import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  amount?: number | string;

  @IsOptional()
  @IsString()
  billing_cycle?: string;

  @IsOptional()
  @IsUUID()
  account_id?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  next_billing_date?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
