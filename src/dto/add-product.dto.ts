import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ProductStatus } from '@/enums';

export class AddProductDto {
  @IsString()
  categoryId!: string;

  @IsString()
  pCategoryId!: string;

  @IsString()
  name!: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  desc?: string;

  @IsOptional()
  @IsNumber()
  status?: ProductStatus.FOR_SALE;

  @IsOptional()
  @IsString()
  imgs?: string[];

  @IsOptional()
  @IsString()
  detail?: string;
}
