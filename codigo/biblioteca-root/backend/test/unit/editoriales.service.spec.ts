import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EditorialesService } from '../../src/editoriales/editoriales.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('EditorialesService', () => {
  let service: EditorialesService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditorialesService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<EditorialesService>(EditorialesService);
  });

  it('should create nueva editorial', async () => {
    const dto = { nombre: 'Editorial XYZ' };
    const expected = { id_editorial: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('editorial');
    expect(query.insert).toHaveBeenCalledWith([dto]);
  });

  it('should return todas las editoriales', async () => {
    const expected = [{ id_editorial: 1, nombre: 'Editorial XYZ' }];

    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('editorial');
  });

  it('should return editorial por ID', async () => {
    const expected = { id_editorial: 1, nombre: 'Editorial XYZ' };
    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_editorial', 1);
  });

  it('should update editorial', async () => {
    const dto = { nombre: 'Editorial Actualizada' };
    const expected = { id_editorial: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete editorial', async () => {
    query.result = { data: { id_editorial: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});