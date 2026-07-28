import 'reflect-metadata';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/bootstrap';

let cachedExpressApp: express.Express;

async function bootstrap(): Promise<express.Express> {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  configureApp(nestApp);
  await nestApp.init();

  cachedExpressApp = expressApp;
  return cachedExpressApp;
}

export default async function handler(
  request: express.Request,
  response: express.Response,
): Promise<unknown> {
  const server = await bootstrap();
  return server(request, response);
}
