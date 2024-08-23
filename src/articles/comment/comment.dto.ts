import { Expose, Transform } from 'class-transformer';

export class CommentDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  isApproved: boolean;

  @Expose()
  @Transform(({ obj }) => obj.author.username)
  author: string;

  @Expose()
  @Transform(({ obj }) => obj.article.id)
  articleId: string;
}
