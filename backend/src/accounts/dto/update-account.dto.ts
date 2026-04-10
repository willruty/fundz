import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateAccountDto {
  /** ID is sent in the body (Go parity: PUT /account/ with id in payload). */
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
