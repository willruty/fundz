import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Extracts the authenticated userId from `request.user`.
 *
 * Equivalent to Go's `c.MustGet("userID").(string)`.
 *
 * Usage:
 *   @Get()
 *   findAll(@CurrentUser() userId: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return (request.user as { userId: string }).userId;
  },
);
