import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { User } from '../users/user.entity';
import { ArticleComment } from './comment/comment.entity';
import { CreateArticleDto } from './dtos/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(ArticleComment)
    private commentRepository: Repository<ArticleComment>,
  ) {}

  async incrementViews(articleId: string, user: User) {
    if (user.role === 'visitor') {
      const article = await this.articleRepository.findOne({
        where: { id: articleId },
      });
      article.views = (article.views || 0) + 1;

      await this.articleRepository.save(article);
    }
  }

  async findOne(articleId: string, user: User) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (user.role !== 'dataAnalyst') {
      const { views, ...rest } = article;
      return rest as Article;
    }
    return article;
  }

  async findAll() {
    const articles = await this.articleRepository.find();
    return articles;
  }

  async createArticle(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    console.log(user);
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can create articles');
    }
    const article = this.articleRepository.create({
      ...createArticleDto,
      views: 0,
      author: user,
    });
    return this.articleRepository.save(article);
  }

  async deleteArticle(articleId: string, user: User) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can delete articles');
    }
    await this.articleRepository.delete({ id: articleId });
  }
}
