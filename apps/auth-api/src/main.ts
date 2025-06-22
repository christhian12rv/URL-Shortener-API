import 'dotenv/config';
import apm from 'elastic-apm-node';

if (process.env.APM_ENABLED === 'true') {
  apm.start({
    serviceName: process.env.ELASTIC_APM_AUTH_API_SERVICE_NAME,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    secretToken: process.env.ELASTIC_APM_SECRET_TOKEN || null,
    environment: process.env.ELASTIC_APM_ENVIRONMENT || null,
    verifyServerCert:
      process.env.ELASTIC_APM_VERIFY_SERVER_CERT === 'true' || false,
  });
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@repo/shared/filters/http-exception.filter';
import { ValidationPipe } from '@repo/shared/pipes/validation.pipe';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = new DocumentBuilder()
      .setTitle('API de Autenticação')
      .setDescription('API responsável pela autenticação de usuários')
      .setVersion('1.0')
      .build();

    const swaggerDocumentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      process.env.AUTH_API_SWAGGER_PATH,
      app,
      swaggerDocumentFactory,
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.AUTH_API_PORT;
    await app.listen(port);

    logger.log(`Application is running on: ${process.env.AUTH_API_BASE_URL}`);
    logger.log(
      `Swagger is running on: ${process.env.AUTH_API_BASE_URL}/${process.env.AUTH_API_SWAGGER_PATH}'`,
    );
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
