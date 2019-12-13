import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  name!: string;

  @IsNumber()
  create_time!: number;

  @IsArray()
  menus!: string[];

  @IsString()
  _id!: string;

  @IsNumber()
  __v!: number;

  @IsString()
  @IsOptional()
  auth_name!: string;
}
