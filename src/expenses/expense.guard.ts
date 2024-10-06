import {
    CanActivate,
    ExecutionContext,
    Injectable,
    BadRequestException,
  } from '@nestjs/common';
  
  @Injectable()
  export class UserGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const userId = request.headers['userid'];
  
      if (!userId) {
        throw new BadRequestException('User ID must be  in headers');
      }
  
      request.userId = userId;
      return true;
    }
  }
  