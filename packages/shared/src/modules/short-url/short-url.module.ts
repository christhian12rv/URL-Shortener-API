import { Module } from '@nestjs/common';
import { ShortUrlRepository } from './infrastructure/repositories/short-url.repository';

@Module({
  providers: [ShortUrlRepository],
  exports: [ShortUrlRepository],
})
export class ShortUrlModule {}
