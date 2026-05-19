import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';

describe('LibrosController', () => {
  let controller: LibrosController;
  let service: LibrosService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getDashboardStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [{ provide: LibrosService, useValue: mockService }],
    }).compile();

    controller = module.get<LibrosController>(LibrosController);
    service = module.get<LibrosService>(LibrosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = {
        titulo: 'Clean Code',
        isbn: '123',
        id_autor: 1,
        id_editorial: 1,
        id_categoria: 1,
      };
      jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce({ id_libro: 1, ...dto } as any);
      const result = await controller.create(dto);
      expect(result.id_libro).toBe(1);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all libros', async () => {
      const data = [{ id_libro: 1 }];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
      const result = await controller.findAll();
      expect(result).toEqual(data);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one libro', async () => {
      const data = { id_libro: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
      const result = await controller.findOne(1);
      expect(result).toEqual(data);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getDashboardStats', () => {
    it('should return dashboard stats', async () => {
      const stats = { libros: 10, usuarios: 5, ejemplares: 15 };
      jest.spyOn(service, 'getDashboardStats').mockResolvedValueOnce(stats);
      const result = await controller.getDashboardStats();
      expect(result).toEqual(stats);
      expect(service.getDashboardStats).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update libro', async () => {
      const dto = { titulo: 'Updated Title' };
      const updated = { id_libro: 1, ...dto };
      jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
      const result = await controller.update(1, dto);
      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete libro', async () => {
      const deleted = { deleted: true };
      jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted);
      const result = await controller.remove(1);
      expect(result).toEqual(deleted);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
