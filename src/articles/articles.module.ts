import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './articles.service';
import { Article } from './article.entity';
import { ArticlesController } from './articles.controllers';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  controllers: [ArticlesController],
  providers: [ArticleService],
})
export class ArticlesModule {}
