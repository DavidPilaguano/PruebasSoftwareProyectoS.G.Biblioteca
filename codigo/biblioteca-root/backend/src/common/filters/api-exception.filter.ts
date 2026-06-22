import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ApiErrorResponse {
  success: false;
  statusCode: number;
  method: string;
  path: string;
  message: string | string[];
  error: string;
  timestamp: string;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message = this.getMessage(exception, exceptionResponse);
    const error = this.getError(status, exceptionResponse);

    const body: ApiErrorResponse = {
      success: false,
      statusCode: status,
      method: request.method,
      path: request.url,
      message,
      error,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(body);
  }

  private getMessage(
    exception: unknown,
    exceptionResponse: string | object | null,
  ): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      exceptionResponse !== null &&
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const message = (exceptionResponse as { message: unknown }).message;
      if (typeof message === 'string' || Array.isArray(message)) {
        return message as string | string[];
      }
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Error interno del servidor';
  }

  private getError(
    status: number,
    exceptionResponse: string | object | null,
  ): string {
    if (
      exceptionResponse !== null &&
      typeof exceptionResponse === 'object' &&
      'error' in exceptionResponse
    ) {
      const error = (exceptionResponse as { error: unknown }).error;
      if (typeof error === 'string') {
        return error;
      }
    }

    return status >= 500 ? 'Internal Server Error' : 'Bad Request';
  }
}
