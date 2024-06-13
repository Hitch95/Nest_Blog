import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async incrementViews(articleId: string, user: User) {
    if (user.role !== 'visitor') {
      throw new ForbiddenException('Only visitor can increment views');
    }
    await this.articleRepository.increment({ id: articleId }, 'views', 1);
  }

  async findOne(articleId: string, user: User) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (user.role !== 'dataAnalyst') {
      article.views = null; // Hide views for unauthorized roles
    }
    return article;
  }

  async createArticle(
    articleData: Partial<Article>,
    user: User,
  ): Promise<Article> {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can create articles');
    }
    const article = this.articleRepository.create({
      ...articleData,
      author: user,
    });
    return this.articleRepository.save(article);
  }

  async addComment(articleId: string, comment: string, user: User) {
    if (user.role !== 'visitor') {
      throw new ForbiddenException('Only visitor can add comments');
    }
    const article = await this.findOne(articleId, user);
    article.comment = comment;
    article.isCommentApproved = false;
    await this.articleRepository.save(article);
  }

  async approveComment(articleId: string, user: User) {
    if (user.role !== 'moderator') {
      throw new ForbiddenException('Only moderator can approve comments');
    }
    const article = await this.findOne(articleId, user);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    article.isCommentApproved = true;
    await this.articleRepository.save(article);
  }

  async deleteArticle(articleId: string, user: User) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only administrators can delete articles');
    }
    await this.articleRepository.delete({ id: articleId });
  }
}
