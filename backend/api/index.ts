/**
 * Vercel serverless entry point for the NestJS backend.
 *
 * Vercel invokes this file for every request. NestJS is bootstrapped once
 * (cold start) and subsequent invocations reuse the same application instance.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';
import { EnvironmentVariables } from '../src/config/env.validation';

const server = express();
let appReady: Promise<void> | null = null;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  app.setGlobalPrefix('fundz');

  const allowedOrigin = config.get('ALLOWED_ORIGIN', { infer: true });
  type CorsOriginCallback = (err: Error | null, allow?: boolean) => void;
  app.enableCors({
    origin: (origin: string | undefined, callback: CorsOriginCallback) => {
      if (!origin) return callback(null, true);
      if (origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
        return callback(null, true);
      }
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      if (allowedOrigin && origin === allowedOrigin) return callback(null, true);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: ['Origin', 'Content-Type', 'Content-Length', 'Accept', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    maxAge: 12 * 60 * 60,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
}

export default function handler(req: express.Request, res: express.Response) {
  if (!appReady) {
    appReady = bootstrap();
  }
  appReady.then(() => server(req, res));
}
