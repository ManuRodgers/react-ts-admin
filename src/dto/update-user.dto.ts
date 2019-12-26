import { IsString, MinLength, MaxLength, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  username!: string;

  @IsOptional()
  @IsString()
  phone!: string;

  @IsString()
  _id!: string;

  @IsOptional()
  @IsString()
  role_id!: string;

  @IsOptional()
  @IsEmail()
  email!: string;
}
