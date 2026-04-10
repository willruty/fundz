import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';

/**
 * Global exception filter that normalises every HTTP error into the Go-parity
 * envelope: `{ "error": "<message>" }`.
 *
 * Mirrors the behaviour of Gin's `c.AbortWithStatusJSON(code, gin.H{"error": msg})`.
 */
@Catch(HttpException)
export class HttpExceptionResponseFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionResponseFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    // NestJS ValidationPipe returns { message: string | string[], error, statusCode }.
    // We collapse array messages into one comma-separated string.
    let message: string;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const obj = exceptionResponse as Record<string, unknown>;
      if (Array.isArray(obj.message)) {
        message = obj.message.join(', ');
      } else if (typeof obj.message === 'string') {
        message = obj.message;
      } else {
        message = exception.message;
      }
    } else {
      message = exception.message;
    }

    if (status >= 500) {
      this.logger.error(`${status} — ${message}`, exception.stack);
    }

    response.status(status).json({ error: message });
  }
}
