import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@repo/shared/exceptions/base-http.exception';

export class ShortUrlNotFoundException extends BaseHttpException {
  constructor(message = 'Url encurtada não encontrada') {
    super(message, HttpStatus.UNAUTHORIZED, 'SHORT_URL_NOT_FOUND');
  }
}
