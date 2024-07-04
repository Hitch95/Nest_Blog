import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { ArticleComment } from './comment.entity';
import { Article } from '../article.entity';
import { User } from 'src/users/user.entity';
import { Role } from 'src/users/user.entity';

import { CommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(ArticleComment)
    private commentRepository: Repository<ArticleComment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async addComment(
    articleId: string,
    content: string,
    user: User,
  ): Promise<ArticleComment> {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (user.role === 'visitor') {
      if (user.warningReceived >= 10) {
        throw new ForbiddenException(
          'You are permanently banned from commenting',
        );
      }

      if (user.warningReceived >= 2) {
        const now = new Date();
        const suspensionEndDate = new Date(user.suspensionStartDate);
        suspensionEndDate.setMonth(suspensionEndDate.getMonth() + 1);

        if (now < suspensionEndDate) {
          throw new ForbiddenException(
            'You are temporarily banned from commenting.',
          );
        }
      }
    }

    const comment = this.commentRepository.create({
      content,
      author: user,
      article,
    });

    const createdComment = await this.commentRepository.save(comment);
    return this.commentRepository.findOne({
      where: { id: createdComment.id },
      relations: ['author', 'article'],
    });
  }

  async approveComment(
    articleId: string,
    commentId: string,
    user: User,
  ): Promise<void> {
    if (user.role !== Role.Moderator) {
      throw new ForbiddenException('Only a moderator can approve comments');
    }

    const comment = await this.commentRepository.findOne({
      where: { id: commentId, article: { id: articleId } },
      relations: ['article'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    comment.isApproved = true;

    await this.commentRepository.save(comment);
  }
}
