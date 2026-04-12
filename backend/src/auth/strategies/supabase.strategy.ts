import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { EnvironmentVariables } from '../../config/env.validation';
import { JwtPayload } from '../types/jwt-payload.type';

/**
 * Validates Supabase-issued JWTs on protected routes.
 *
 * Supabase now signs tokens with ES256 (asymmetric ECDSA key).
 * We verify using the JWKS endpoint from Supabase Auth so we never
 * need to store the private key — only the public key is used.
 *
 * JWKS endpoint: https://<project>.supabase.co/auth/v1/.well-known/jwks.json
 */
@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor(config: ConfigService<EnvironmentVariables, true>) {
    const supabaseUrl = config.get('SUPABASE_URL', { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKeyProvider fetches the public key from Supabase's JWKS endpoint.
      // Falls back to HS256 secret for legacy tokens (Go backend).
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
      }),
      algorithms: ['ES256', 'HS256'],
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
