import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { LibrosService } from '../../src/libros/libros.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('LibrosService', () => {
  let service: LibrosService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrosService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
  });

  it('should create nuevo libro', async () => {
    const dto = { id_categoria: 1, id_editorial: 2, titulo: 'Nuevo Libro' };
    const expected = { id_libro: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('libro');
    expect(query.insert).toHaveBeenCalledWith([dto]);
  });

  it('should throw when id_categoria or id_editorial are missing', async () => {
    await expect(service.create({ id_categoria: 0 } as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return todos los libros', async () => {
    const expected = [{ id_libro: 1, titulo: 'Nuevo Libro' }];
    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('libro');
  });

  it('should return libro por ID', async () => {
    const expected = { id_libro: 1, titulo: 'Nuevo Libro' };
    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_libro', 1);
  });

  it('should throw NotFoundException when libro no existe', async () => {
    query.result = { data: null, error: { message: 'Not found' } };

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update libro', async () => {
    const dto = { titulo: 'Libro Actualizado' };
    const expected = { id_libro: 1, ...dto };
    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete libro', async () => {
    query.result = { data: null, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});
