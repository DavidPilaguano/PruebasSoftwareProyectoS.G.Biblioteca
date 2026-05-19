import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';

describe('CategoriasController', () => {
  let controller: CategoriasController;
  let service: CategoriasService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [{ provide: CategoriasService, useValue: mockService }],
    }).compile();

    controller = module.get<CategoriasController>(CategoriasController);
    service = module.get<CategoriasService>(CategoriasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = { nombre: 'Ficción' };
      jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce({ id_categoria: 1, ...dto } as any);
      const result = await controller.create(dto);
      expect(result.id_categoria).toBe(1);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const data = [{ id_categoria: 1 }];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
      const result = await controller.findAll();
      expect(result).toEqual(data);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one category', async () => {
      const data = { id_categoria: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
      const result = await controller.findOne(1);
      expect(result).toEqual(data);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update category', async () => {
      const dto = { nombre: 'No Ficción' };
      const updated = { id_categoria: 1, ...dto };
      jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
      const result = await controller.update(1, dto);
      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete category', async () => {
      const deleted = { deleted: true };
      jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted);
      const result = await controller.remove(1);
      expect(result).toEqual(deleted);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
