import { Module } from '@nestjs/common';
import { PrismaModule } from '@repo/shared/modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UrlShortenerModule } from './modules/url-shortener/url-shortener.module';
import { RedirectionModule } from './modules/redirection/redirection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UrlShortenerModule,
    RedirectionModule,
  ],
})
export class AppModule {}
