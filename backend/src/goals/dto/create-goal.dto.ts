import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  target_amount!: number | string;

  @IsOptional()
  current_amount?: number | string;

  @IsOptional()
  due_date?: string;
}
