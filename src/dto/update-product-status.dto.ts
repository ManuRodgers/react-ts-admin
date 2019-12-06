import { IsString } from 'class-validator';
import { ProductStatus } from '@/enums';

export class UpdateProductStatusDto {
  @IsString()
  productId!: string;

  @IsString()
  status!: ProductStatus;
}
