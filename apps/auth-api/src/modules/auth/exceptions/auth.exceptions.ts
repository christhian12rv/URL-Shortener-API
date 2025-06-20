import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@repo/shared/exceptions/base-http.exception';

export class LoginInvalidCredentialsException extends BaseHttpException {
  constructor(message = 'Email ou senha inválidos') {
    super(message, HttpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS');
  }
}

export class UserWithEmailAlreadyExistsException extends BaseHttpException {
  constructor(
    message = 'Esse email já está cadastrado. Faça login para continuar',
  ) {
    super(message, HttpStatus.CONFLICT, 'USER_WITH_EMAIL_ALREADY_EXISTS');
  }
}
