import apm from 'elastic-apm-node';
apm.start({
  serviceName: process.env.ELASTIC_APM_URL_SHORTENER_API_SERVICE_NAME,
  verifyServerCert: false,
  serverUrl: process.env.ELASTIC_APM_SERVER_URL,
  logLevel: 'debug',
});

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
      .setTitle('API de Encurtamento de Urls')
      .setDescription('API responsável por encurtar Urls')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Digite o token de autenticação JWT',
          name: 'Autenticação',
          in: 'header',
        },
        'auth-token',
      )
      .build();

    const swaggerDocumentFactory = () =>
      SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      process.env.URL_SHORTENER_SERVICE_SWAGGER_PATH,
      app,
      swaggerDocumentFactory,
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.URL_SHORTENER_SERVICE_PORT;
    await app.listen(port);

    logger.log(
      `Application is running on: ${process.env.BASE_URL_SHORTENER_SERVICE_URL}`,
    );
    logger.log(
      `Swagger is running on: ${process.env.BASE_URL_SHORTENER_SERVICE_URL}/${process.env.URL_SHORTENER_SERVICE_SWAGGER_PATH}`,
    );
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
