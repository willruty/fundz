import { plainToInstance } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUrl, Max, Min, validateSync } from 'class-validator';

/**
 * Typed, validated representation of the backend environment.
 *
 * Boot fails immediately if a REQUIRED variable is missing/invalid.
 * Optional variables (e.g. Supabase admin keys) are validated only when present —
 * services that consume them are expected to fail loudly at call time if empty.
 */
export class EnvironmentVariables {
  // === Service ===
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(65535)
  SERVICE_PORT: number = 8000;

  @IsOptional()
  @IsString()
  ALLOWED_ORIGIN?: string;

  // === Database (Prisma) ===
  @IsString()
  DATABASE_URL!: string;

  @IsString()
  DIRECT_URL!: string;

  // === Supabase ===
  @IsUrl({ require_tld: false })
  SUPABASE_URL!: string;

  /**
   * Public anon key — used by the browser-facing Supabase client on the backend
   * (e.g. validating a user's JWT against Supabase Auth). Optional for now; will be
   * required once the UsersModule (Step 12) goes live.
   */
  @IsOptional()
  @IsString()
  SUPABASE_ANON_KEY?: string;

  /**
   * Service-role key — grants admin access to Supabase (bypasses RLS). Required
   * by the Admin API (register/delete users). Optional for now; will be required
   * once the UsersModule (Step 12) goes live. NEVER expose to the frontend.
   */
  @IsOptional()
  @IsString()
  SUPABASE_SERVICE_ROLE_KEY?: string;

  /**
   * Legacy HS256 JWT secret (kept for backward compat). Auth now uses ES256
   * via the Supabase JWKS endpoint — this field is no longer required.
   */
  @IsOptional()
  @IsString()
  SUPABASE_JWT_SECRET?: string;

  /**
   * UUID of the guest/visitor account (visitante@fundz.app).
   * When set, all mutating requests (POST/PUT/PATCH/DELETE) from this user
   * are blocked with 403 — the account is read-only for demo purposes.
   */
  @IsOptional()
  @IsString()
  GUEST_USER_ID?: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
    whitelist: false,
    forbidUnknownValues: false,
  });

  if (errors.length > 0) {
    const formatted = errors
      .map((err) => {
        const constraints = err.constraints ? Object.values(err.constraints).join(', ') : '';
        return `  - ${err.property}: ${constraints}`;
      })
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${formatted}`);
  }

  return validated;
}
