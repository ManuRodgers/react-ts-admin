import { IsString, MinLength, MaxLength, IsOptional, IsEmail } from 'class-validator';

export class AddUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  username!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  password!: string;

  @IsOptional()
  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  role_id!: string;

  @IsOptional()
  @IsEmail()
  email!: string;
}
