 
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { EjemplaresController } from '../../src/ejemplares/ejemplares.controller';
import { EjemplaresService } from '../../src/ejemplares/ejemplares.service';

describe('EjemplaresController', () => {
  let controller: EjemplaresController;
  let service: EjemplaresService;

  const mockEjemplaresService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EjemplaresController],
      providers: [
        {
          provide: EjemplaresService,
          useValue: mockEjemplaresService,
        },
      ],
    }).compile();

    controller = module.get<EjemplaresController>(EjemplaresController);
    service = module.get<EjemplaresService>(EjemplaresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new record', async () => {
      const dto = {
        /* mock data */
      } as any;
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
      const dto = {
        /* mock data */
      } as any;
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a record', async () => {
      const result = { deleted: true };
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove(1)).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
