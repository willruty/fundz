import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateInstallmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  total_amount!: number | string;

  @IsNotEmpty()
  installment_amount!: number | string;

  @IsInt()
  @Min(1)
  total_installments!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  paid_installments?: number;

  @IsNotEmpty()
  start_date!: string;

  @IsInt()
  @Min(1)
  @Max(31)
  billing_day!: number;

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
