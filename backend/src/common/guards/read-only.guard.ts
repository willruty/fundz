import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../config/env.validation';

/**
 * Blocks all mutating HTTP methods for the guest/visitor account.
 * Configured via GUEST_USER_ID env var (the auth.users UUID of visitante@fundz.app).
 * If the env var is not set this guard is a no-op.
 */
@Injectable()
export class ReadOnlyGuard implements CanActivate {
  private readonly guestUserId: string | undefined;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    this.guestUserId = config.get('GUEST_USER_ID', { infer: true });
  }

  canActivate(context: ExecutionContext): boolean {
    if (!this.guestUserId) return true;

    const request = context.switchToHttp().getRequest<{
      user?: { userId: string };
      method: string;
    }>();

    const userId = request.user?.userId;
    const method = request.method.toUpperCase();
    const READ_METHODS = ['GET', 'HEAD', 'OPTIONS'];

    if (userId === this.guestUserId && !READ_METHODS.includes(method)) {
      throw new ForbiddenException('Conta visitante — somente leitura');
    }

    return true;
  }
}
