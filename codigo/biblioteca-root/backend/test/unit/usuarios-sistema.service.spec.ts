 
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosSistemaService } from '../../src/usuarios-sistema/usuarios-sistema.service';
import { AuthService } from '../../src/usuarios-sistema/auth.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import { createQueryMock } from './supabase-client.mock';
import type { CreateUsuarioSistemaDto } from '../../src/usuarios-sistema/dto/create-usuario-sistema.dto';
import type { UpdateUsuarioSistemaDto } from '../../src/usuarios-sistema/dto/update-usuario-sistema.dto';

describe('UsuariosSistemaService', () => {
  let service: UsuariosSistemaService;
  let fromMock: jest.Mock;
  let supabaseMock: {
    client: { from: jest.MockedFunction<(table: string) => typeof query> };
  };
  let query: ReturnType<typeof createQueryMock>;

  beforeEach(async () => {
    query = createQueryMock();
    fromMock = jest.fn().mockReturnValue(query);
    supabaseMock = { client: { from: fromMock } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosSistemaService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<UsuariosSistemaService>(UsuariosSistemaService);
  });

  it('should create usuario del sistema y ocultar password_hash', async () => {
    const dto: CreateUsuarioSistemaDto = {
      username: 'admin',
      password: 'secret',
      rol_sistema: 'ADMINISTRADOR',
    };
    const expected = {
      id_usuario_sistema: 1,
      username: 'admin',
      rol_sistema: 'ADMINISTRADOR',
      estado: 'ACTIVO',
    };

    query.result = {
      data: { ...expected, password_hash: 'hashed' },
      error: null,
    };

    await expect(service.create(dto)).resolves.toEqual(expected);
    expect(fromMock).toHaveBeenCalledWith('usuario_sistema');
  });

  it('should throw when rol_sistema es inválido', async () => {
    await expect(
      service.create({
        username: 'admin',
        password: 'secret',
        rol_sistema: 'INVALIDO',
      } as CreateUsuarioSistemaDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return todos los usuarios del sistema sin password_hash', async () => {
    const expected = [
      {
        id_usuario_sistema: 1,
        username: 'admin',
        rol_sistema: 'ADMINISTRADOR',
      },
    ];
    query.result = {
      data: [{ ...expected[0], password_hash: 'hashed' }],
      error: null,
    };

    await expect(service.findAll()).resolves.toEqual(expected);
  });

  it('should return usuario del sistema por ID sin password_hash', async () => {
    const expected = {
      id_usuario_sistema: 1,
      username: 'admin',
      rol_sistema: 'ADMINISTRADOR',
    };
    query.result = {
      data: { ...expected, password_hash: 'hashed' },
      error: null,
    };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_usuario_sistema', 1);
  });

  it('should update usuario del sistema y ocultar password_hash', async () => {
    const dto: UpdateUsuarioSistemaDto = { password: 'newSecret' };
    const expected = {
      id_usuario_sistema: 1,
      username: 'admin',
      rol_sistema: 'ADMINISTRADOR',
    };
    query.result = {
      data: { ...expected, password_hash: 'newHash' },
      error: null,
    };

    await expect(service.update(1, dto)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalled();
  });

  it('should delete usuario del sistema', async () => {
    query.result = { data: { id_usuario_sistema: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});

describe('AuthService', () => {
  let authService: AuthService;
  let supabaseMock: { client: { from: jest.MockedFunction<(table: string) => typeof query> } };
  let jwtServiceMock: { sign: jest.MockedFunction<(payload: unknown) => string> };
  let query: ReturnType<typeof createQueryMock>;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };
    jwtServiceMock = { sign: jest.fn().mockReturnValue('jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: supabaseMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should login exitoso y retornar token', async () => {
    query.result = {
      data: {
        id_usuario_sistema: 1,
        username: 'admin',
        rol_sistema: 'ADMINISTRADOR',
        primer_nombre: 'Admin',
        primer_apellido: 'User',
        password_hash: 'secret',
      },
      error: null,
    };

    await expect(authService.login('admin', 'secret')).resolves.toEqual({
      access_token: 'jwt-token',
      user: {
        id: 1,
        username: 'admin',
        rol_sistema: 'ADMINISTRADOR',
        nombre: 'Admin User',
      },
    });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    query.result = { data: null, error: { message: 'No user' } };

    await expect(authService.login('admin', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
