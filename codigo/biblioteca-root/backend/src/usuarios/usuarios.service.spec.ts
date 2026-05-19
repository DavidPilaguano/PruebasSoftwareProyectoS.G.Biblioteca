import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;
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
        UsuariosService,
        { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  describe('create', () => {
    it('should throw BadRequestException if id_rol is missing', async () => {
      await expect(
        service.create({
          primer_nombre: 'John',
          primer_apellido: 'Doe',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException on supabase error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'DB Error' },
      });
      await expect(
        service.create({
          id_rol: 1,
          primer_nombre: 'John',
          primer_apellido: 'Doe',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create and return usuario data', async () => {
      const newUsuario = {
        id_usuario: 1,
        id_rol: 1,
        primer_nombre: 'John',
        primer_apellido: 'Doe',
        estado: 'ACTIVO',
      };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: newUsuario,
        error: null,
      });
      const result = await service.create({
        id_rol: 1,
        primer_nombre: 'John',
        primer_apellido: 'Doe',
      });
      expect(result.id_usuario).toBe(1);
      expect(result.estado).toBe('ACTIVO');
    });

    it('should use default estado ACTIVO when not provided', async () => {
      const newUsuario = {
        id_usuario: 1,
        id_rol: 1,
        primer_nombre: 'John',
        primer_apellido: 'Doe',
        estado: 'ACTIVO',
      };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: newUsuario,
        error: null,
      });
      await service.create({
        id_rol: 1,
        primer_nombre: 'John',
        primer_apellido: 'Doe',
      });
      expect(mockSupabaseClient.insert).toHaveBeenCalled();
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

    it('should return array of usuarios', async () => {
      const usuarios = [
        { id_usuario: 1, primer_nombre: 'John' },
        { id_usuario: 2, primer_nombre: 'Jane' },
      ];
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: usuarios,
        error: null,
      });
      const result = await service.findAll();
      expect(result).toEqual(usuarios);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no usuarios', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: null,
      });
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user is not found (null data)', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: null,
      });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if error occurs', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Not found' },
      });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

    it('should return usuario data', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_usuario: 1, email: 'test@test.com' },
        error: null,
      });
      const result = await service.findOne(1);
      expect(result.id_usuario).toBe(1);
      expect(result.email).toBe('test@test.com');
    });
  });

  describe('update', () => {
    it('should throw BadRequestException on supabase error', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Update failed' },
      });
      await expect(
        service.update(1, { primer_nombre: 'Jane' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update and return usuario data', async () => {
      const updatedUsuario = {
        id_usuario: 1,
        primer_nombre: 'Jane',
        primer_apellido: 'Doe',
      };
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: updatedUsuario,
        error: null,
      });
      const result = await service.update(1, { primer_nombre: 'Jane' });
      expect(result.id_usuario).toBe(1);
      expect(result.primer_nombre).toBe('Jane');
    });

    it('should call update with correct parameters', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: {},
        error: null,
      });
      await service.update(1, { primer_nombre: 'Jane' });
      expect(mockSupabaseClient.update).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id_usuario', 1);
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

    it('should delete usuario and return success', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({ data: {}, error: null });
      const result = await service.remove(1);
      expect(result.deleted).toBe(true);
    });

    it('should call delete with correct parameters', async () => {
      mockSupabaseClient.delete.mockReturnThis();
      mockSupabaseClient.eq.mockResolvedValueOnce({ data: {}, error: null });
      await service.remove(1);
      expect(mockSupabaseClient.delete).toHaveBeenCalled();
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id_usuario', 1);
    });
  });
});
