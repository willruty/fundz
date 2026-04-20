import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount!: number;

  /** Annual yield rate in percent (e.g. 13.65 for 13.65% a.a.) */
  @IsNumber()
  @Min(0)
  @Max(1000)
  @Type(() => Number)
  annualRate!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  monthlyAport?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
