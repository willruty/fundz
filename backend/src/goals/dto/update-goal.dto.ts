import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateGoalDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  target_amount?: number | string;

  @IsOptional()
  current_amount?: number | string;

  @IsOptional()
  due_date?: string;
}
