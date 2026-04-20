import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatar_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  impulsive_item_name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  impulsive_unit_price?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  impulsive_quantity?: number;
}
