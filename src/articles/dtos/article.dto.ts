import { Expose, Transform } from 'class-transformer';
import { Article } from '../article.entity';
import { User } from 'src/users/user.entity';

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

  @Expose()
  @Transform(({ obj }) => obj.author.id)
  userId: string;

  @Expose()
  approved: boolean;

  constructor(article: Article) {
    this.id = article.id;
    this.title = article.title;
    this.content = article.content;
    this.author = article.author.username;
    this.tag = article.tag;
    this.creationDate = article.creationDate;
    this.dateOfUpdate = article.dateOfUpdate;
    this.views = article.views;
    this.userId = article.author.id;

    if (article.author.role === 'dataAnalyst') {
      this.views = article.views;
    }
  }
}
