/**
 * Vercel serverless entry point for the NestJS backend.
 *
 * Plain JS (not TS) to avoid esbuild/decorator issues.
 * Imports from the pre-built dist/ directory (compiled by `nest build`).
 *
 * NestJS is bootstrapped once on cold start; warm invocations reuse the app.
 */
const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { ConfigService } = require('@nestjs/config');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();
let appPromise = null;

async function bootstrap() {
  const { AppModule } = require('../dist/app.module');

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  const config = app.get(ConfigService);

  app.setGlobalPrefix('fundz');

  const allowedOrigin = config.get('ALLOWED_ORIGIN');
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === 'http://localhost:5173' || origin === 'http://localhost:3000') {
        return callback(null, true);
      }
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      if (allowedOrigin && origin === allowedOrigin) return callback(null, true);
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  return server;
}

module.exports = async (req, res) => {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  const app = await appPromise;
  app(req, res);
};
