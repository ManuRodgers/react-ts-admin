import { IsString } from 'class-validator';

export class AddCategoryDto {
  @IsString()
  parentId!: string;

  @IsString()
  categoryName!: string;
}
