import { IsString } from 'class-validator';

export class GetCategoriesDto {
  @IsString()
  parentId!: string;
}
