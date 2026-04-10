import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from '../../config/env.validation';
import { JwtPayload } from '../types/jwt-payload.type';

/**
 * Validates Supabase-issued JWTs (HS256) on protected routes.
 *
 * Replicates backend-go/internal/service/jwt.go — ValidateJWT:
 *   1. Verify signature with SUPABASE_JWT_SECRET + HS256.
 *   2. Extract userId from `sub` (Supabase standard).
 *   3. Fallback to `user_id` (legacy Go tokens).
 *   4. Reject if neither is present.
 */
@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(config: ConfigService<EnvironmentVariables, true>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SUPABASE_JWT_SECRET', { infer: true }),
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }

  /**
   * Called by Passport after the JWT signature is verified.
   * Returns the value that will be attached to `request.user`.
   */
  validate(payload: JwtPayload): { userId: string } {
    // Prioritize `sub` (Supabase standard), fallback to `user_id` (legacy).
    const userId = payload.sub || payload.user_id;

    if (!userId) {
      throw new UnauthorizedException('Token sem identificador de usuário');
    }

    return { userId };
  }
}
