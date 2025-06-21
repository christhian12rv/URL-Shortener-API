import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@repo/shared/filters/http-exception.filter';
import { ValidationPipe } from '@repo/shared/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.URL_SHORTENER_SERVICE_PORT);
}

bootstrap();
