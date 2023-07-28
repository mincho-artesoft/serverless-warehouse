/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import * as dynamoose from 'dynamoose';
import { bootstrapServer } from './app/bootstrap';

async function bootstrap() {
  // const ddb = new DynamoDB({
  //   region: process.env.REGION,
  //    //endpoint: "http://localhost:8000"
  // });

  const cachedNestApp = await bootstrapServer();
  
  //dynamoose.aws.ddb.set(ddb);
  //const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  // const port = process.env.PORT || 3001;
  // await app.listen(port);
  // Logger.log(
  //   `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  // );

  await cachedNestApp.app.listen('3001');
}

bootstrap();
