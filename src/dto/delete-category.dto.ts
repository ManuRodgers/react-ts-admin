import { IsString } from 'class-validator';

export class DeleteCategoryDto {
  @IsString()
  categoryId!: string;
}
