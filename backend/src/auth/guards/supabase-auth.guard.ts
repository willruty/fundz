import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

/**
 * Global guard registered via APP_GUARD.
 *
 * Behaviour:
 *   - Routes decorated with @Public() are allowed through.
 *   - All other routes require a valid Supabase JWT.
 *
 * Error messages replicate backend-go/internal/middleware/auth_middleware.go.
 */
@Injectable()
export class SupabaseAuthGuard extends AuthGuard('supabase') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * Override to produce PT-BR messages matching the Go backend.
   */
  handleRequest<TUser>(err: Error | null, user: TUser, info: Error | undefined): TUser {
    if (err || !user) {
      // `info?.message` from passport-jwt: "No auth token", "jwt expired", etc.
      const message =
        info?.message === 'No auth token' ? 'Token não fornecido' : 'Token inválido';
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
