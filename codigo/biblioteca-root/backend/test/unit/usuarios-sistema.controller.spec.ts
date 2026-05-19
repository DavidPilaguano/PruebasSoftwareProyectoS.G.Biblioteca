import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosSistemaController } from '../../src/usuarios-sistema/usuarios-sistema.controller';
import { UsuariosSistemaService } from '../../src/usuarios-sistema/usuarios-sistema.service';

describe('UsuariosSistemaController', () => {
  let controller: UsuariosSistemaController;
  let service: UsuariosSistemaService;

  const mockUsuariosSistemaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosSistemaController],
      providers: [
        {
          provide: UsuariosSistemaService,
          useValue: mockUsuariosSistemaService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosSistemaController>(UsuariosSistemaController);
    service = module.get<UsuariosSistemaService>(UsuariosSistemaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const dto = { /* mock data */ } as any;
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of records', async () => {
      const result = [{ id: 1 }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single record', async () => {
      const result = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne(1)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a record', async () => {
      const dto = { /* mock data */ } as any;
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update(1, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a record', async () => {
      const result = { deleted: true };
      jest.spyOn(service, 'remove').mockResolvedValue(result as any);

      expect(await controller.remove(1)).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

});
