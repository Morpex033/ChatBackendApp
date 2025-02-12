import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { UserDto } from '../../user/dto/user.dto';
import { AccountRole } from '../../user/enum/account-role.enum';
import { Roles } from '../decorator/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user: UserDto = request.user;

    return this.matchRoles(roles, user.account.role);
  }

  private matchRoles(
    roles: AccountRole[],
    userRole: AccountRole,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (roles.some((role) => role === userRole)) return true;

    throw new ForbiddenException('Access denied');
  }
}
