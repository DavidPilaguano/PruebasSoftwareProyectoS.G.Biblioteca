import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { map, Observable } from 'rxjs';

interface ApiResponse<T> {
  success: true;
  statusCode: number;
  method: string;
  path: string;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context
      .switchToHttp()
      .getResponse<{ statusCode: number }>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        method: request.method,
        path: request.url,
        message: this.getMessage(request.method),
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }

  private getMessage(method: string): string {
    const messages: Record<string, string> = {
      GET: 'Consulta realizada correctamente',
      POST: 'Registro creado correctamente',
      PATCH: 'Registro actualizado correctamente',
      PUT: 'Registro actualizado correctamente',
      DELETE: 'Registro eliminado correctamente',
    };

    return messages[method] ?? 'Operacion realizada correctamente';
  }
}
