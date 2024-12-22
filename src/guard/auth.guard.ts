import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IS_PERMIT_ALL } from '../decorator/auth.decorator';
import { ROLES } from '../decorator/roles.decorator';
import { Role } from '../common/const/role';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PERMIT_ALL, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request['member'] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

    } catch (err) {
      throw new UnauthorizedException(err);
    }

    const roles: string[] = this.reflector.getAllAndOverride<string[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    const role: string = request['member'].role;

    return this.validateRole(roles, role);
  }

  private validateRole(roles: string[], memberRole: string): boolean {
    // @Roles()가 없는 경우
    if (!roles) {
      return true;
    } else if (!roles.length) {
      // @Roles()만 입력한 경우
      return true;
    }

    // 사용자의 역할이 있을 경우
    if (roles.includes(memberRole)) {
      return true;
    } else if (memberRole === Role.SUPER_ADMIN) {
      // 슈퍼 어드민 역할을 모두 통과
      return true;
    } else {
      throw new ForbiddenException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
