import awsLambdaFastify, {
  LambdaResponse,
  PromiseHandler,
} from '@fastify/aws-lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { bootstrapServer, NestApp } from './../bootstrap';

let cachedNestApp: NestApp;
let cachedProxy: PromiseHandler<unknown, LambdaResponse>;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!cachedNestApp) {
    cachedNestApp = await bootstrapServer();
    cachedProxy = awsLambdaFastify(cachedNestApp.instance, {
      decorateRequest: true,
    });
  }

  await cachedNestApp.instance.ready();

  return cachedProxy(event, context);
};

/*const ddb = new DynamoDB({
  region: process.env.REGION,
  // endpoint: "http://localhost:8000"
});

dynamoose.aws.ddb.set(ddb);

// This code is now wrapped in an async function
const app = await NestFactory.create(AppModule);
const globalPrefix = 'api';
app.setGlobalPrefix(globalPrefix);
const port = process.env.PORT || 3000;
await app.listen(port);
Logger.log(
  `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
);*/
