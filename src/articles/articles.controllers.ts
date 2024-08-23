import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Role, User } from 'src/users/user.entity';
import { Article } from './article.entity';
import { ArticleService } from './articles.service';

import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

import { Roles } from 'src/users/decorator/role.decorator';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { CreateArticleDto } from './dtos/create-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @UseGuards(AuthGuard, RoleGuard)
  async getArticles(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.Admin, Role.Moderator, Role.DataAnalyst)
  async getArticle(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Article> {
    await this.articleService.incrementViews(id, user);
    return this.articleService.findOne(id, user);
  }

  @Post()
  @Roles(Role.Admin)
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: User,
  ): Promise<Article> {
    return this.articleService.createArticle(createArticleDto, user);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteArticle(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.articleService.deleteArticle(id, user);
  }
}
