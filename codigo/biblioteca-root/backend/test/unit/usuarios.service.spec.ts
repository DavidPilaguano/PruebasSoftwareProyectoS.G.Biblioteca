import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UsuariosService } from '../../src/usuarios/usuarios.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should create nuevo usuario', async () => {
    const dto = { id_rol: 1, primer_nombre: 'Ana', primer_apellido: 'Lopez' };
    const expected = { id_usuario: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('usuario');
    expect(query.insert).toHaveBeenCalledWith([{ ...dto, estado: 'ACTIVO' }]);
  });

  it('should throw when id_rol is missing', async () => {
    await expect(service.create({} as any)).rejects.toThrow(BadRequestException);
  });

  it('should return todos los usuarios', async () => {
    const expected = [{ id_usuario: 1, primer_nombre: 'Ana', primer_apellido: 'Lopez' }];
    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('usuario');
  });

  it('should return usuario por ID', async () => {
    const expected = { id_usuario: 1, primer_nombre: 'Ana', primer_apellido: 'Lopez' };
    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_usuario', 1);
  });

  it('should update usuario', async () => {
    const dto = { primer_nombre: 'Ana', primer_apellido: 'Martínez' };
    const expected = { id_usuario: 1, ...dto };
    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete usuario', async () => {
    query.result = { data: { id_usuario: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});