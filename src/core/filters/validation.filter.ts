import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'sequelize';

@Catch(ValidationError)
export class SequelizeValidationFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const validationErrors = exception.errors
      .map((err) => err.message)
      .join(', ');

    response.status(HttpStatus.BAD_REQUEST).json({
      message: validationErrors,
    });
  }
}
