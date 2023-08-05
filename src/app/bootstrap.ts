import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { fastify, FastifyInstance, FastifyServerOptions } from 'fastify';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import * as dynamoose from 'dynamoose';
import { DynamoDB } from '@aws-sdk/client-dynamodb';


export const logger = new Logger('bootstrap');

export const getApplicationModule = (): any | never => {
  return AppModule
};

export const appModuleLogInfo = (logger: Logger) => {
  logger.debug('▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒');
};

export interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}


export const bootstrapServer = async (): Promise<NestApp> => {
  const serverOptions: FastifyServerOptions = { logger: true };

  const AppModule = getApplicationModule();
  const instance: FastifyInstance = fastify(serverOptions);
  const ddb = new DynamoDB({
    region: process.env.REGION,
     //endpoint: "http://localhost:8000"
  });
  dynamoose.aws.ddb.set(ddb);
  const app = await NestFactory.create<INestApplication & NestFastifyApplication>(
    AppModule,
    (new FastifyAdapter((instance) as any)) as any,
    {
      logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console,
    },
  );

  setupNestApp(app);
  await app.init();
  return { app, instance };
};

export const setupNestApp = (app: INestApplication & NestFastifyApplication) => {
  app.use(compression());
  app.use(cookieParser());

  app.setGlobalPrefix('api/warehouse');
  app.enableCors({
    allowedHeaders:"*",
    origin: "*"
  });
};
