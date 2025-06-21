import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@repo/shared/filters/http-exception.filter';
import { ValidationPipe } from '@repo/shared/pipes/validation.pipe';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalPipes(new ValidationPipe());

    const port = process.env.URL_SHORTENER_SERVICE_PORT;
    await app.listen(port);

    logger.log(
      `Application is running on: ${process.env.BASE_URL_SHORTENER_SERVICE_URL}`,
    );
    logger.log(
      `Swagger is running on: ${process.env.BASE_URL_SHORTENER_SERVICE_URL}/api`,
    );
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
