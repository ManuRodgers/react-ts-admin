import { IsString } from 'class-validator';

export class AddRoleDto {
  @IsString()
  roleName!: string;
}
