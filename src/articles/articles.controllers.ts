import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Article } from './article.entity';
import { ArticleService } from './articles.service';

import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

import { Roles } from 'src/users/decorator/role.decorator';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';

@Controller('articles')
@UseGuards(AuthGuard, RoleGuard)
export class ArticlesController {
  constructor(private readonly articleService: ArticleService) {}

  @Get(':id')
  async getArticle(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Article> {
    await this.articleService.incrementViews(id, user);
    return this.articleService.findOne(id, user);
  }

  @Post()
  @Roles('admin')
  async createArticle(
    @Body() articleData: Partial<Article>,
    @CurrentUser() user: User,
  ): Promise<Article> {
    return this.articleService.createArticle(articleData, user);
  }

  @Post(':id/comment')
  @Roles('visitor')
  async addComment(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.articleService.addComment(id, comment, user);
  }

  @Post(':id/approve')
  @Roles('moderator')
  async approveComment(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.articleService.approveComment(id, user);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteArticle(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.articleService.deleteArticle(id, user);
  }
}
