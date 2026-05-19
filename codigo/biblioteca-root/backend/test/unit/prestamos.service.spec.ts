import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrestamosService } from '../../src/prestamos/prestamos.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('PrestamosService', () => {
  let service: PrestamosService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrestamosService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<PrestamosService>(PrestamosService);
  });

  it('should create nuevo préstamo', async () => {
    const dto = { id_usuario: 1, id_ejemplar: 1, fecha_prestamo: '2026-01-01' };
    const expected = { id_prestamo: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('prestamo');
    expect(query.insert).toHaveBeenCalledWith([dto]);
  });

  it('should return todos los préstamos', async () => {
    const expected = [{ id_prestamo: 1, estado: 'ACTIVO' }];
    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('prestamo');
  });

  it('should return préstamo por ID', async () => {
    const expected = { id_prestamo: 1, estado: 'ACTIVO' };
    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_prestamo', 1);
  });

  it('should throw NotFoundException when préstamo no existe', async () => {
    query.result = { data: null, error: { message: 'Not found' } };

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update préstamo', async () => {
    const dto = { estado: 'DEVUELTO' };
    const expected = { id_prestamo: 1, ...dto };
    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete préstamo', async () => {
    const expected = { id_prestamo: 1 };
    query.result = { data: expected, error: null };

    await expect(service.remove(1)).resolves.toEqual(expected);
    expect(query.delete).toHaveBeenCalled();
  });
});
