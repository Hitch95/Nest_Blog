import { IsString } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  tag: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
