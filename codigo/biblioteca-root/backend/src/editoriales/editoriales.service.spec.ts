import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { EditorialesService } from './editoriales.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EditorialesService', () => {
  let service: EditorialesService;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditorialesService,
        { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
      ],
    }).compile();

    service = module.get<EditorialesService>(EditorialesService);
  });

  describe('create', () => {
    it('should create an editorial successfully', async () => {
      const dto = { nombre: 'Editorial Nueva' };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_editorial: 1, ...dto },
        error: null,
      });
      const result = await service.create(dto);
      expect(result.id_editorial).toBe(1);
    });

    it('should throw BadRequestException on error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB Error' },
      });
      await expect(service.create({ nombre: 'Test' } as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all editoriales', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: [{ id_editorial: 1 }],
        error: null,
      });
      const result = await service.findAll();
      expect(result).toEqual([{ id_editorial: 1 }]);
    });

    it('should throw BadRequestException on error', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB Error' },
      });
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });

    it('should return empty array when data is null', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: null,
      });
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an editorial if found', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_editorial: 1 },
        error: null,
      });
      const result = await service.findOne(1);
      expect(result.id_editorial).toBe(1);
    });

    it('should throw NotFoundException if editorial is null', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null,
      });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException on error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' },
      });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an editorial', async () => {
      const updated = { id_editorial: 1, nombre: 'Editorial Actualizada' };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: updated,
        error: null,
      });
      const result = await service.update(1, {
        nombre: 'Editorial Actualizada',
      });
      expect(result.nombre).toBe('Editorial Actualizada');
    });

    it('should throw BadRequestException on error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Update failed' },
      });
      await expect(service.update(1, { nombre: 'Test' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete an editorial', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({ data: {}, error: null });
      const result = await service.remove(1);
      expect(result.deleted).toBe(true);
    });

    it('should throw BadRequestException on delete error', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Delete failed' },
      });
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
