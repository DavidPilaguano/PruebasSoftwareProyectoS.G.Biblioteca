import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UsuariosController } from '../../src/usuarios/usuarios.controller';
import { UsuariosService } from '../../src/usuarios/usuarios.service';
import type { CreateUsuarioDto } from '../../src/usuarios/dto/create-usuario.dto';
import type { UpdateUsuarioDto } from '../../src/usuarios/dto/update-usuario.dto';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let createMock: jest.Mock;
  let findAllMock: jest.Mock;
  let findOneMock: jest.Mock;
  let updateMock: jest.Mock;
  let removeMock: jest.Mock;
  let mockUsuariosService: Partial<UsuariosService>;

  beforeEach(async () => {
    createMock = jest.fn();
    findAllMock = jest.fn();
    findOneMock = jest.fn();
    updateMock = jest.fn();
    removeMock = jest.fn();

    mockUsuariosService = {
      create: createMock,
      findAll: findAllMock,
      findOne: findOneMock,
      update: updateMock,
      remove: removeMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const dto: CreateUsuarioDto = {
        id_rol: 1,
        primer_nombre: 'Test',
        primer_apellido: 'User',
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
      const dto: UpdateUsuarioDto = { primer_nombre: 'Nuevo' };
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
