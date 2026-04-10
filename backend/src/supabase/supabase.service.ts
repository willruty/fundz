import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { EnvironmentVariables } from '../config/env.validation';

/**
 * Wraps two Supabase clients:
 *
 *   - `supabase`       → anon key, respects RLS. Safe for user-scoped operations.
 *   - `supabaseAdmin`  → service_role key, bypasses RLS. Use ONLY for
 *                        server-side admin ops (user registration, deletion, etc.).
 *
 * Both clients are created lazily so the backend can still boot when the
 * corresponding key is absent (development convenience). Accessing a client
 * whose key was not provided throws a clear error at call time.
 */
@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);

  private _anon: SupabaseClient | null = null;
  private _admin: SupabaseClient | null = null;

  constructor(private readonly config: ConfigService<EnvironmentVariables, true>) {}

  onModuleInit(): void {
    const url = this.config.get('SUPABASE_URL', { infer: true });
    const anonKey = this.config.get('SUPABASE_ANON_KEY', { infer: true });
    const serviceKey = this.config.get('SUPABASE_SERVICE_ROLE_KEY', { infer: true });

    if (anonKey) {
      this._anon = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      this.logger.log('Supabase anon client ready');
    } else {
      this.logger.warn('SUPABASE_ANON_KEY not set — anon client disabled');
    }

    if (serviceKey) {
      this._admin = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      this.logger.log('Supabase admin (service_role) client ready');
    } else {
      this.logger.warn('SUPABASE_SERVICE_ROLE_KEY not set — admin client disabled');
    }
  }

  /** Anon Supabase client. Throws if `SUPABASE_ANON_KEY` is missing. */
  get supabase(): SupabaseClient {
    if (!this._anon) {
      throw new InternalServerErrorException(
        'Supabase anon client is not configured (missing SUPABASE_ANON_KEY).',
      );
    }
    return this._anon;
  }

  /** Admin Supabase client (service_role). Throws if `SUPABASE_SERVICE_ROLE_KEY` is missing. */
  get supabaseAdmin(): SupabaseClient {
    if (!this._admin) {
      throw new InternalServerErrorException(
        'Supabase admin client is not configured (missing SUPABASE_SERVICE_ROLE_KEY).',
      );
    }
    return this._admin;
  }
}
