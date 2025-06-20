import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayloadDTO } from '../dtos/auth-jwt-payload.dto';
import { InvalidAuthenticationBearerTokenException } from '../exceptions/jwt.exceptions';

export const CurrentAuthenticatedAuthJwtPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthJwtPayloadDTO => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);

      try {
        const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
        const payload = jwtService.verify(token);
        return payload;
      } catch (e) {
        throw new InvalidAuthenticationBearerTokenException();
      }
    }

    return null;
  },
);
