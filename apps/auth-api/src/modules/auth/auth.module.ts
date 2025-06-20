import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AuthService } from './infrastructure/services/auth.service';
import { UserModule } from '@repo/shared/modules/user/user.module';
import { PasswordModule } from '@repo/shared/modules/password/password.module';
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
    UserModule,
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
