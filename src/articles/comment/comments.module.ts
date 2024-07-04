import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { ArticleComment } from './comment.entity';
import { User } from 'src/users/user.entity';
import { ArticlesModule } from '../articles.module';
import { Article } from '../article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleComment, Article, User]),
    forwardRef(() => ArticlesModule),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [TypeOrmModule, CommentService],
})
export class CommentsModule {}
