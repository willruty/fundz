import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  account_id!: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsNotEmpty()
  amount!: number | string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  occurred_at?: string;
}
