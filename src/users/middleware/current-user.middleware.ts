import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    console.log('Middleware - Session:', req.session);
    console.log('Middleware - userId:', userId);

    if (userId) {
      try {
        const user = await this.usersService.findOne(userId);
        // @ts-ignore
        req.currentUser = user;
        console.log('Middleware - Found user:', user);
      } catch (error) {
        console.error('Middleware - Error fetching user:', error);
      }
    }

    next();
  }
}
