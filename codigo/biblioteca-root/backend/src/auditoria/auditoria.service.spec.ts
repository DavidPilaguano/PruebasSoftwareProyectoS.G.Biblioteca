import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AuditoriaService } from './auditoria.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuditoriaService', () => {
  let service: AuditoriaService;
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
        AuditoriaService,
        { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
      ],
    }).compile();

    service = module.get<AuditoriaService>(AuditoriaService);
  });

  describe('create', () => {
    it('should create audit record', async () => {
      const dto = {
        tabla_afectada: 'usuario',
        id_registro: 1,
        accion: 'INSERT',
      };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_auditoria: 1, ...dto },
        error: null,
      });
      const result = await service.create(dto as any);
      expect(result.id_auditoria).toBe(1);
    });

    it('should throw BadRequestException on missing fields', async () => {
      await expect(
        service.create({ tabla_afectada: 'usuario' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on db error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB Error' },
      });
      await expect(
        service.create({
          tabla_afectada: 'usuario',
          id_registro: 1,
          accion: 'UPDATE',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all audit records', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: [{ id_auditoria: 1 }],
        error: null,
      });
      const result = await service.findAll();
      expect(result.length).toBe(1);
    });

    it('should return empty array on null', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: null,
      });
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should throw BadRequestException on error', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB Error' },
      });
      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return audit record if found', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_auditoria: 1 },
        error: null,
      });
      const result = await service.findOne(1);
      expect(result.id_auditoria).toBe(1);
    });

    it('should throw NotFoundException if not found', async () => {
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
    it('should update audit record', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_auditoria: 1, accion: 'DELETE' },
        error: null,
      });
      const result = await service.update(1, { accion: 'DELETE' });
      expect(result.accion).toBe('DELETE');
    });

    it('should throw BadRequestException on error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Update failed' },
      });
      await expect(service.update(1, { accion: 'DELETE' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete audit record', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: null });
      const result = await service.remove(1);
      expect(result.deleted).toBe(true);
    });

    it('should throw BadRequestException on error', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Delete failed' },
      });
      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
