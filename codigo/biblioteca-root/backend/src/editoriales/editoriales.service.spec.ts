import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
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

  describe('findAll', () => {
    it('should return all editoriales', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({ data: [{ id_editorial: 1 }], error: null });
      const result = await service.findAll();
      expect(result).toEqual([{ id_editorial: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should return an editorial if found', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_editorial: 1 }, error: null });
      const result = await service.findOne(1);
      expect(result.id_editorial).toBe(1);
    });

    it('should throw NotFoundException if editorial is null', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: null });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create an editorial successfully', async () => {
      const dto = { nombre: 'Editorial Nueva' };
      mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_editorial: 1, ...dto }, error: null });
      const result = await service.create(dto as any);
      expect(result.id_editorial).toBe(1);
    });
  });
});