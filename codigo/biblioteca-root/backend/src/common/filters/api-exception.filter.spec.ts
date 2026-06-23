import {
  BadRequestException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { describe, expect, it, jest } from '@jest/globals';
import { ApiExceptionFilter } from './api-exception.filter';

const createHost = () => {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const request = { method: 'POST', url: '/test' };

  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => request,
    }),
  } as any;

  return { host, status, json };
};

describe('ApiExceptionFilter', () => {
  it('wraps string HttpException responses', () => {
    const filter = new ApiExceptionFilter();
    const { host, status, json } = createHost();

    filter.catch(new BadRequestException('Dato invalido'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 400,
        method: 'POST',
        path: '/test',
        message: 'Dato invalido',
        error: 'Bad Request',
      }),
    );
  });

  it('wraps object HttpException responses with array messages and error', () => {
    const filter = new ApiExceptionFilter();
    const { host, status, json } = createHost();
    const exception = new HttpException(
      { message: ['campo requerido'], error: 'Validation Error' },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ['campo requerido'],
        error: 'Validation Error',
      }),
    );
  });

  it('uses Error messages for unknown exceptions', () => {
    const filter = new ApiExceptionFilter();
    const { host, status, json } = createHost();

    filter.catch(new Error('Fallo inesperado'), host);

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Fallo inesperado',
        error: 'Internal Server Error',
      }),
    );
  });

  it('uses default message for non Error unknown exceptions', () => {
    const filter = new ApiExceptionFilter();
    const { host, json } = createHost();

    filter.catch('boom', host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error interno del servidor',
      }),
    );
  });

  it('keeps explicit server error for InternalServerErrorException', () => {
    const filter = new ApiExceptionFilter();
    const { host, json } = createHost();

    filter.catch(new InternalServerErrorException(), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        error: 'Internal Server Error',
      }),
    );
  });
});
