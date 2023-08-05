import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as $RefParser from '@apidevtools/json-schema-ref-parser';
import { AppModule } from '../app/app.module';

  async function generateSwaggerDocument() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/warehouse');

  const config = new DocumentBuilder()
  .addServer('https://ioeys2zarf.execute-api.eu-central-1.amazonaws.com/dev')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);

  const docJson = JSON.parse(JSON.stringify(document));
  const dereferencedDocument = await $RefParser.dereference(docJson);

  fs.writeFileSync('./warehouse.swagger.json', JSON.stringify(dereferencedDocument));
  await app.close();
}

generateSwaggerDocument().catch(console.error);
