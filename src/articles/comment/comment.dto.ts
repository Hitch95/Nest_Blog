import { Expose, Transform } from 'class-transformer';
import { Article } from '../article.entity';
import { User } from 'src/users/user.entity';
import { ArticleComment } from './comment.entity';

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
