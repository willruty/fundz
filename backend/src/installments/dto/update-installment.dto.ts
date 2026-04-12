import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpdateInstallmentDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  total_amount?: number | string;

  @IsOptional()
  installment_amount?: number | string;

  @IsOptional()
  @IsInt()
  @Min(1)
  total_installments?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  paid_installments?: number;

  @IsOptional()
  start_date?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  billing_day?: number;

  @IsOptional()
  @IsUUID()
  account_id?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
