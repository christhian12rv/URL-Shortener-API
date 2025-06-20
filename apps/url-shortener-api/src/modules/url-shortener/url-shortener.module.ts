import { Module } from '@nestjs/common';
import { UrlShortenerController } from './infrastructure/controllers/url-shortener.controller';
import { UrlShortenerService } from './infrastructure/services/url-shortener.service';
import { ShortUrlModule } from '@repo/shared/modules/short-url/short-url.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@repo/shared/modules/jwt/strategies/jwt.strategy';

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
    ShortUrlModule,
  ],
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, JwtStrategy],
})
export class UrlShortenerModule {}
