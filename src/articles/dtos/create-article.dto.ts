import { IsString } from 'class-validator';
import { CreateDateColumn } from 'typeorm';

export class CreateArticleDto {
  @IsString()
  author: string;

  @CreateDateColumn()
  creationDate: Date;

  @IsString()
  tag: string;

  @IsString()
  title: string;

  @IsString()
  content: string;
}
