 
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoriasService } from '../../src/categorias/categorias.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<CategoriasService>(CategoriasService);
  });

  it('should create nueva categoría', async () => {
    const dto = { nombre: 'Ciencia' };
    const expected = { id_categoria: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('categoria');
    expect(query.insert).toHaveBeenCalledWith([dto]);
  });

  it('should throw when nombre is missing', async () => {
    await expect(service.create({ nombre: '' } as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return todas las categorías', async () => {
    const expected = [{ id_categoria: 1, nombre: 'Ciencia' }];

    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('categoria');
  });

  it('should return categoría por ID', async () => {
    const expected = { id_categoria: 1, nombre: 'Ciencia' };

    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_categoria', 1);
  });

  it('should update categoría', async () => {
    const dto = { nombre: 'Historia' };
    const expected = { id_categoria: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should eliminar categoría', async () => {
    query.result = { data: { id_categoria: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});
