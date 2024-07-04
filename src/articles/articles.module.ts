import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './articles.service';
import { Article } from './article.entity';
import { ArticlesController } from './articles.controllers';
import { ArticleComment } from './comment/comment.entity';
import { User } from 'src/users/user.entity';
import { CommentsModule } from './comment/comments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleComment, User]),
    forwardRef(() => CommentsModule),
  ],
  controllers: [ArticlesController],
  providers: [ArticleService],
})
export class ArticlesModule {}
