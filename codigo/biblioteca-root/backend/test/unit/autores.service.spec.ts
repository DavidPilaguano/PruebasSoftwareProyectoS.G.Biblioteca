import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AutoresService } from '../../src/autores/autores.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('AutoresService', () => {
  let service: AutoresService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutoresService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<AutoresService>(AutoresService);
  });

  it('should create nuevo autor', async () => {
    const dto = { primer_nombre: 'Gabriel', primer_apellido: 'García' };
    const expected = { id_autor: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('autor');
    expect(query.insert).toHaveBeenCalledWith([dto]);
  });

  it('should throw when primer_nombre or primer_apellido faltan', async () => {
    await expect(service.create({ primer_nombre: '', primer_apellido: '' } as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should return lista completa de autores', async () => {
    const expected = [{ id_autor: 1, primer_nombre: 'Ana', primer_apellido: 'Lopez' }];

    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('autor');
  });

  it('should return autor por ID', async () => {
    const expected = { id_autor: 1, primer_nombre: 'Ana', primer_apellido: 'Lopez' };

    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_autor', 1);
  });

  it('should throw NotFoundException when autor no existe', async () => {
    query.result = { data: null, error: { message: 'No encontrado' } };

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update autor', async () => {
    const dto = { primer_nombre: 'Ana', primer_apellido: 'Rojas' };
    const expected = { id_autor: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete autor', async () => {
    query.result = { data: { id_autor: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});