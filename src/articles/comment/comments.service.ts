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
    isApproved: boolean,
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

    comment.isApproved = isApproved;
    isApproved = true;
    // await this.commentRepository.save(comment);

    await this.commentRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.save(comment);
      },
    );
  }
}
