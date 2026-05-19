 
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { RolesService } from '../../src/roles/roles.service';
import { SupabaseService } from '../../src/supabase/supabase.service';
import { createQueryMock } from './supabase-client.mock';
import type { CreateRolDto } from '../../src/roles/dto/create-rol.dto';
import type { UpdateRolDto } from '../../src/roles/dto/update-rol.dto';

describe('RolesService', () => {
  let service: RolesService;
  let fromMock: jest.Mock;
  let supabaseMock: { client: { from: jest.MockedFunction<(table: string) => typeof query> } };
  let query: ReturnType<typeof createQueryMock>;

  beforeEach(async () => {
    query = createQueryMock();
    fromMock = jest.fn().mockReturnValue(query);
    supabaseMock = { client: { from: fromMock } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: SupabaseService, useValue: supabaseMock },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should create nuevo rol', async () => {
    const dto: CreateRolDto = { max_prestamos: 5, dias_prestamo: 14 };
    const expected = { id_rol: 1, ...dto };

    query.result = { data: expected, error: null };

    await expect(service.create(dto)).resolves.toEqual(expected);
    expect(fromMock).toHaveBeenCalledWith('rol_usuario');
    expect(query.insert).toHaveBeenCalledWith([dto]);
  });

  it('should throw when max_prestamos or dias_prestamo are missing', async () => {
    await expect(
      service.create({ max_prestamos: undefined } as CreateRolDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return todos los roles', async () => {
    const expected = [{ id_rol: 1, max_prestamos: 5 }];
    query.result = { data: expected, error: null };

    await expect(service.findAll()).resolves.toEqual(expected);
    expect(fromMock).toHaveBeenCalledWith('rol_usuario');
  });

  it('should return rol por ID', async () => {
    const expected = { id_rol: 1, max_prestamos: 5 };
    query.result = { data: expected, error: null };

    await expect(service.findOne(1)).resolves.toEqual(expected);
    expect(query.eq).toHaveBeenCalledWith('id_rol', 1);
  });

  it('should update rol', async () => {
    const dto: UpdateRolDto = { max_prestamos: 10 };
    const expected = { id_rol: 1, ...dto };
    query.result = { data: expected, error: null };

    await expect(service.update(1, dto)).resolves.toEqual(expected);
    expect(query.update).toHaveBeenCalledWith(dto);
  });

  it('should delete rol', async () => {
    query.result = { data: { id_rol: 1 }, error: null };

    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    expect(query.delete).toHaveBeenCalled();
  });
});
