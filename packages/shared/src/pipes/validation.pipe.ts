import {
  BadRequestException,
  Injectable,
  ValidationError,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const formattedErrors = ValidationPipe.formatErrors(validationErrors);
        return new BadRequestException({
          message: 'Ocorreram um ou mais erros de validação',
          code: 'VALIDATION_ERROR',
          errors: formattedErrors,
        });
      },
    });
  }

  private static formatErrors(
    validationErrors: ValidationError[],
    parentProperty = '',
  ): Array<{ property: string; errors: string[] }> {
    const errors: Array<{ property: string; errors: string[] }> = [];

    const getValidationErrorsRecursively = (
      validationErrors: ValidationError[],
      parentProperty = '',
    ) => {
      for (const error of validationErrors) {
        const propertyPath = parentProperty
          ? `${parentProperty}.${error.property}`
          : error.property;

        if (error.constraints) {
          errors.push({
            property: propertyPath,
            errors: Object.values(error.constraints),
          });
        }

        if (error.children?.length) {
          getValidationErrorsRecursively(error.children, propertyPath);
        }
      }
    };

    getValidationErrorsRecursively(validationErrors, parentProperty);

    return errors;
  }
}
