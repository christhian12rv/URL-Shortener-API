import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseHttpException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    public readonly code?: string,
  ) {
    super(
      {
        message,
        code: code || 'HTTP_ERROR',
      },
      statusCode,
    );
  }
}
