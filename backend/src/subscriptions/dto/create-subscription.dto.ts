import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  amount!: number | string;

  @IsString()
  @IsNotEmpty()
  billing_cycle!: string;

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
