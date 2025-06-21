import { Module } from '@nestjs/common';
import { RedirectionController } from './infrastructure/controllers/redirection.controller';
import { UrlShortenerModule } from '../url-shortener/url-shortener.module';

@Module({
  imports: [UrlShortenerModule],
  controllers: [RedirectionController],
})
export class RedirectionModule {}
