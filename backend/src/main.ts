import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  // Global prefix — preserves 1:1 parity with the Go backend (/fundz/*).
  app.setGlobalPrefix('fundz');

  // CORS — replicates backend-go/internal/router/main_router.go (configRouter).
  const allowedOrigin = config.get('ALLOWED_ORIGIN', { infer: true });
  type CorsOriginCallback = (err: Error | null, allow?: boolean) => void;
  app.enableCors({
    origin: (origin: string | undefined, callback: CorsOriginCallback) => {
      // Non-browser clients (curl, server-to-server) have no Origin header.
      if (!origin) {
        return callback(null, true);
      }

      if (origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
        return callback(null, true);
      }

      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      if (allowedOrigin && origin === allowedOrigin) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
      'Origin',
      'Content-Type',
      'Content-Length',
      'Accept',
      'Authorization',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    maxAge: 12 * 60 * 60,
  });

  // Global validation — mirrors Gin's binding:"required,email,min=6" tags.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : config.get('SERVICE_PORT', { infer: true });
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
