import {
  Controller,
  Post,
  Param,
  Body,
  UseGuards,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './create-comment.dto';
import { CurrentUser } from 'src/users/decorator/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Roles } from 'src/users/decorator/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/users/user.entity';
import { plainToClass } from 'class-transformer';
import { CommentDto } from './comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  @UseGuards(AuthGuard)
  @Roles(Role.Moderator)
  async getComments(): Promise<CommentDto[]> {
    const comments = await this.commentService.getComments();
    return plainToClass(CommentDto, comments);
  }

  @Post('article/:id')
  @UseGuards(AuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: User,
  ): Promise<CommentDto> {
    const comment = await this.commentService.addComment(
      id,
      createCommentDto.content,
      user,
    );
    return plainToClass(CommentDto, comment);
  }

  @Post('article/:articleId/comment/:commentId/approve')
  @Roles(Role.Moderator)
  @UseGuards(AuthGuard, RoleGuard)
  async approveComment(
    @Param('articleId') articleId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.commentService.approveComment(articleId, commentId, user);
  }

  @Delete('article/:articleId/comment/:commentId')
  @Roles(Role.Moderator)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteComment(
    @Param('articleId') articleId: string,
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.commentService.deleteComment(articleId, commentId, user);
  }
}
