import { Module } from '@nestjs/common';
import { UrlShortenerController } from './infrastructure/controllers/url-shortener.controller';
import { UrlShortenerService } from './infrastructure/services/url-shortener.service';
import { ShortUrlModule } from '@repo/shared/modules/short-url/short-url.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@repo/shared/modules/jwt/strategies/jwt.strategy';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    ShortUrlModule,
  ],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, JwtStrategy],
  exports: [UrlShortenerService],
})
export class UrlShortenerModule {}
