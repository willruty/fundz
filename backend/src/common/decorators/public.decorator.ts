import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as public — bypasses the global SupabaseAuthGuard.
 *
 * Usage:
 *   @Public()
 *   @Get('health')
 *   getHealth() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
