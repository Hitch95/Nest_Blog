import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('Admin Guard', request.currentUser);

    if (!request.currentUser) {
      return false;
    }
    //Returns true if the currentUser is 'admin'
    return request.currentUser.admin;
  }
}
