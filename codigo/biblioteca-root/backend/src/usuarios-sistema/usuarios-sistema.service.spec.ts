import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { UsuariosSistemaService } from './usuarios-sistema.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsuariosSistemaService', () => {
  let service: UsuariosSistemaService;
  let mockSupabaseClient: any;

  beforeEach(async () => {
    mockSupabaseClient = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosSistemaService,
        { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
      ],
    }).compile();

    service = module.get<UsuariosSistemaService>(UsuariosSistemaService);
  });

  describe('create', () => {
    it('should successfully create a system user', async () => {
      const dto = {
        username: 'david.test',
        password: '123',
        primer_nombre: 'D',
        primer_apellido: 'P',
        rol_sistema: 'ADMINISTRADOR',
      };
      mockSupabaseClient.single.mockResolvedValue({
        data: { id: 102, username: 'david.test' },
        error: null,
      });
      const result = await service.create(dto);
      expect(result.password_hash).toBeUndefined();
    });

    it('should reject invalid role', async () => {
      await expect(
        service.create({
          username: 'bad.role',
          password: '123456',
          primer_nombre: 'Bad',
          primer_apellido: 'Role',
          rol_sistema: 'OTRO',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject missing password', async () => {
      await expect(
        service.create({
          username: 'sin.password',
          primer_nombre: 'Sin',
          primer_apellido: 'Password',
          rol_sistema: 'BIBLIOTECARIO',
        } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return users without password hash', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: [{ id_usuario_sistema: 1, username: 'admin', password_hash: 'x' }],
        error: null,
      });

      const result = await service.findAll();

      expect(result).toEqual([
        { id_usuario_sistema: 1, username: 'admin', password_hash: undefined },
      ]);
    });

    it('should throw BadRequestException when findAll fails', async () => {
      mockSupabaseClient.select.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error al listar' },
      });

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return user if exists', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: { id: 1 },
        error: null,
      });
      const result = await service.findOne(1);
      expect(result.id).toBe(1);
    });

    it('debería lanzar BadRequestException cuando Supabase retorna error en create', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error de BD' },
      });

      const dto = {
        /* ... tus datos ... */
      };
      await expect(service.create(dto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar error si el préstamo no existe al intentar actualizar', async () => {
      // 1. Forzamos que el mock retorne un error o data vacía
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'No encontrado' },
      });

      // 2. Disparamos la línea que falta (línea roja)
      await expect(service.update(999, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user is missing', async () => {
      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Empty' },
      });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update user and hide password hash', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: {
          id_usuario_sistema: 1,
          username: 'admin',
          primer_nombre: 'Admin',
          password_hash: 'secret',
        },
        error: null,
      });

      const result = await service.update(1, {
        username: 'no-debe-cambiar',
        primer_nombre: 'Admin',
        password: 'nueva-clave',
      } as any);

      expect(mockSupabaseClient.update).toHaveBeenCalledWith(
        expect.objectContaining({
          primer_nombre: 'Admin',
          password_hash: expect.any(String),
        }),
      );
      expect(result.password_hash).toBeUndefined();
    });

    it('should call findOne when update payload is empty after cleanup', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { id_usuario_sistema: 1, username: 'admin', password_hash: 'x' },
        error: null,
      });

      const result = await service.update(1, {
        username: 'admin',
        password_hash: '',
      } as any);

      expect(result.password_hash).toBeUndefined();
      expect(mockSupabaseClient.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when update fails', async () => {
      jest.spyOn(console, 'error').mockImplementationOnce(() => undefined);
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Error update' },
      });

      await expect(
        service.update(1, { primer_nombre: 'Error' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockSupabaseClient.eq.mockResolvedValueOnce({ error: null });

      await expect(service.remove(1)).resolves.toEqual({ deleted: true });
    });

    it('should throw BadRequestException when remove fails', async () => {
      mockSupabaseClient.eq.mockResolvedValueOnce({
        error: { message: 'Error remove' },
      });

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });
});
