import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/shared/modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UrlShortenerModule } from './modules/url-shortener/url-shortener.module';
import { AppController } from './app.controller';
import { UrlShortenerService } from './modules/url-shortener/infrastructure/services/url-shortener.service';
import { ShortUrlModule } from '@repo/shared/modules/short-url/short-url.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UrlShortenerModule,
    ShortUrlModule,
  ],
  controllers: [AppController],
  providers: [UrlShortenerService],
})
export class AppModule {}
