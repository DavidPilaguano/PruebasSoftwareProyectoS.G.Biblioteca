 
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuditoriaService } from '../../src/auditoria/auditoria.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';

describe('AuditoriaService', () => {
  let service: AuditoriaService;
  let supabaseMock: any;
  let query: any;

  beforeEach(async () => {
    query = createQueryMock();
    supabaseMock = { client: { from: jest.fn().mockReturnValue(query) } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditoriaService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<AuditoriaService>(AuditoriaService);
  });

  it('should create registro de auditoría', async () => {
    const dto = { tabla_afectada: 'libro', id_registro: 1, accion: 'CREAR' };
    const expected = { id_auditoria: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto as any)).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('auditoria');
  });

  it('should throw when required fields are missing', async () => {
    await expect(
      service.create({
        tabla_afectada: '',
        id_registro: null,
        accion: '',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return todos los registros de auditoría', async () => {
    const expected = [
      { id_auditoria: 1, tabla_afectada: 'libro', accion: 'CREAR' },
    ];
    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(supabaseMock.client.from).toHaveBeenCalledWith('auditoria');
  });

  it('should return registro por ID', async () => {
    const expected = {
      id_auditoria: 1,
      tabla_afectada: 'libro',
      accion: 'CREAR',
    };
    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_auditoria', 1);
  });

  it('should update registro', async () => {
    const dto = { accion: 'ACTUALIZAR' };
    const expected = {
      id_auditoria: 1,
      tabla_afectada: 'libro',
      accion: 'ACTUALIZAR',
    };
    query.result = { data: expected, error: null };

    await expect(service.update(1, dto as any)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete registro', async () => {
    query.result = { data: { id_auditoria: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});
