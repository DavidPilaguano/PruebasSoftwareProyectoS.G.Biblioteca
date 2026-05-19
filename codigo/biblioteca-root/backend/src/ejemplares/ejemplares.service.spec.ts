import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { EjemplaresService } from './ejemplares.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EjemplaresService', () => {
  let service: EjemplaresService;
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
        EjemplaresService,
        { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
      ],
    }).compile();

    service = module.get<EjemplaresService>(EjemplaresService);
  });

  describe('create', () => {
    it('should throw BadRequestException if id_libro is missing', async () => {
      await expect(
        service.create({ codigo_barra: '123' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create ejemplar with default estado DISPONIBLE', async () => {
      const newEjemplar = {
        id_ejemplar: 1,
        id_libro: 1,
        codigo_barra: '123',
        estado: 'DISPONIBLE',
      };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: newEjemplar,
        error: null,
      });
      const result = await service.create({ id_libro: 1, codigo_barra: '123' });
      expect(result.estado).toBe('DISPONIBLE');
    });

    it('should throw BadRequestException on supabase error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB Error' },
      });
      await expect(
        service.create({ id_libro: 1, codigo_barra: '123' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return empty array on error', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB Error' },
      });
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });

    it('should return array of ejemplares', async () => {
      const ejemplares = [{ id_ejemplar: 1, codigo_barra: '123' }];
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: ejemplares,
        error: null,
      });
      const result = await service.findAll();
      expect(result).toEqual(ejemplares);
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
    it('should throw NotFoundException if error occurs', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' },
      });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if data is null', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null,
      });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should return ejemplar if found', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_ejemplar: 1 },
        error: null,
      });
      const result = await service.findOne(1);
      expect(result.id_ejemplar).toBe(1);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException on supabase error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Update failed' },
      });
      await expect(service.update(1, { estado: 'PRESTADO' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update and return ejemplar', async () => {
      const updated = { id_ejemplar: 1, estado: 'PRESTADO' };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: updated,
        error: null,
      });
      const result = await service.update(1, { estado: 'PRESTADO' });
      expect(result.estado).toBe('PRESTADO');
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException on supabase error', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Delete failed' },
      });
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });

    it('should delete ejemplar and return success', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({ data: {}, error: null });
      const result = await service.remove(1);
      expect(result.deleted).toBe(true);
    });
  });
});
