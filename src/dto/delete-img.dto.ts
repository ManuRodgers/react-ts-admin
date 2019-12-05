import { IsString } from 'class-validator';

export class DeleteImgDto {
  @IsString()
  name!: string;
}
