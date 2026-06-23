import { describe, expect, it } from '@jest/globals';
import { of } from 'rxjs';
import { ApiResponseInterceptor } from './api-response.interceptor';

const createContext = (method: string, statusCode = 200) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ method, url: '/endpoint' }),
      getResponse: () => ({ statusCode }),
    }),
  }) as any;

const collect = async (method: string, statusCode = 200) => {
  const interceptor = new ApiResponseInterceptor();
  const next = { handle: () => of({ ok: true }) };

  return new Promise((resolve) => {
    interceptor.intercept(createContext(method, statusCode), next as any).subscribe(resolve);
  });
};

describe('ApiResponseInterceptor', () => {
  it.each([
    ['GET', 'Consulta realizada correctamente'],
    ['POST', 'Registro creado correctamente'],
    ['PATCH', 'Registro actualizado correctamente'],
    ['PUT', 'Registro actualizado correctamente'],
    ['DELETE', 'Registro eliminado correctamente'],
    ['OPTIONS', 'Operacion realizada correctamente'],
  ])('wraps %s responses', async (method, message) => {
    await expect(collect(method)).resolves.toEqual(
      expect.objectContaining({
        success: true,
        statusCode: 200,
        method,
        path: '/endpoint',
        message,
        data: { ok: true },
      }),
    );
  });
});
