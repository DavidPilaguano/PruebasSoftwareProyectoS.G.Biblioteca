import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UsuariosSistemaController } from '../../src/usuarios-sistema/usuarios-sistema.controller';
import { UsuariosSistemaService } from '../../src/usuarios-sistema/usuarios-sistema.service';
import type { CreateUsuarioSistemaDto } from '../../src/usuarios-sistema/dto/create-usuario-sistema.dto';
import type { UpdateUsuarioSistemaDto } from '../../src/usuarios-sistema/dto/update-usuario-sistema.dto';

describe('UsuariosSistemaController', () => {
  let controller: UsuariosSistemaController;
  let createMock: jest.Mock;
  let findAllMock: jest.Mock;
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;
  let removeMock: jest.Mock;
  let mockUsuariosSistemaService: Partial<UsuariosSistemaService>;

  beforeEach(async () => {
    createMock = jest.fn();
    findAllMock = jest.fn();
    findOneMock = jest.fn();
    updateMock = jest.fn();
    removeMock = jest.fn();

    mockUsuariosSistemaService = {
      create: createMock,
      findAll: findAllMock,
      findOne: findOneMock,
      update: updateMock,
      remove: removeMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosSistemaController],
      providers: [
        {
          provide: UsuariosSistemaService,
          useValue: mockUsuariosSistemaService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosSistemaController>(
      UsuariosSistemaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const dto: CreateUsuarioSistemaDto = {
        username: 'admin',
        password: 'secret',
        rol_sistema: 'ADMINISTRADOR',
      };
      const result = { id: 1, ...dto };
      createMock.mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(createMock).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of records', async () => {
      const result = [{ id: 1 }];
      findAllMock.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(findAllMock).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const result = { id: 1 };
      findOneMock.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(findOneMock).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto: UpdateUsuarioSistemaDto = { password: 'newSecret' };
      const result = { id: 1, ...dto };
      updateMock.mockResolvedValue(result);

      expect(await controller.update(1, dto)).toBe(result);
      expect(updateMock).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a record', async () => {
      const result = { deleted: true };
      removeMock.mockResolvedValue(result);

      expect(await controller.remove(1)).toBe(result);
      expect(removeMock).toHaveBeenCalledWith(1);
    });
  });
});
