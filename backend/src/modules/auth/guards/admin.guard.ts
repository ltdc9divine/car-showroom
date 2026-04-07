import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    console.log('[AdminGuard] User:', user);
    console.log('[AdminGuard] User role:', user?.role);

    if (!user || user.role !== 'admin') {
      console.log('[AdminGuard] Access denied');
      throw new ForbiddenException('Only admins can access this resource');
    }

    console.log('[AdminGuard] Access granted');
    return true;
  }
}
