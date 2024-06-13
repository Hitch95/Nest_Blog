import { IsString } from 'class-validator';
import { UpdateDateColumn } from 'typeorm';

export class UpdateArticleDto {
  @IsString()
  tag: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @UpdateDateColumn()
  dateOfUpdate: Date;
}
