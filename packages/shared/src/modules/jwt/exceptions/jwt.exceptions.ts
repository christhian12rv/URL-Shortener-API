import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '../../../exceptions/base-http.exception';

export class InvalidAuthenticationBearerTokenException extends BaseHttpException {
  constructor(message = 'Token de autenticação inválido') {
    super(
      message,
      HttpStatus.UNAUTHORIZED,
      'INVALID_AUTHENTICATION_BEARER_TOKEN',
    );
  }
}
