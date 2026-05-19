import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EjemplaresService } from '../../src/ejemplares/ejemplares.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('EjemplaresService', () => {
  let service: EjemplaresService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EjemplaresService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<EjemplaresService>(EjemplaresService);
  });

  it('should create nuevo ejemplar', async () => {
    const dto = { id_libro: 1, ubicacion_fisica: 'Estante 1' };
    const expected = { id_ejemplar: 1, ...dto, estado: 'DISPONIBLE' };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('ejemplar');
    expect(query.insert).toHaveBeenCalledWith([
      { ...dto, estado: 'DISPONIBLE' },
    ]);
  });

  it('should throw when id_libro is missing', async () => {
    await expect(
      service.create({ id_libro: undefined } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return todos los ejemplares', async () => {
    const expected = [{ id_ejemplar: 1, estado: 'DISPONIBLE' }];
    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('ejemplar');
  });

  it('should return ejemplar por ID', async () => {
    const expected = { id_ejemplar: 1, estado: 'DISPONIBLE' };
    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_ejemplar', 1);
  });

  it('should update ejemplar', async () => {
    const dto = { estado: 'PRESTADO' };
    const expected = { id_ejemplar: 1, ...dto };
    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete ejemplar', async () => {
    query.result = { data: { id_ejemplar: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});
