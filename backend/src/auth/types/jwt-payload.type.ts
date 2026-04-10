/**
 * Shape of the decoded Supabase JWT payload.
 *
 * Supabase tokens always include `sub` (the auth.users UUID).
 * Legacy tokens from the Go backend may carry `user_id` instead.
 */
export interface JwtPayload {
  /** Supabase standard — auth.users.id (UUID). */
  sub?: string;

  /** Legacy Go backend claim. */
  user_id?: string;

  iat?: number;
  exp?: number;
  aud?: string;
  role?: string;
}
