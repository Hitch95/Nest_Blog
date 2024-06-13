import { Expose, Transform } from 'class-transformer';

export class ArticleDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  author: string;

  @Expose()
  tag: string;

  @Expose()
  creationDate: Date;

  @Expose()
  dateOfUpdate: Date;

  @Expose()
  views: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Expose()
  approved: boolean;
}
