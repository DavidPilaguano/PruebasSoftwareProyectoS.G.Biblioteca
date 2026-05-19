import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { LibrosService } from './libros.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LibrosService', () => {
  let service: LibrosService;
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
        LibrosService,
        { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
      ],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
  });

  describe('create', () => {
    it('should successfully register a book', async () => {
      const dto = { titulo: 'Clean Code', isbn: '123456', id_autor: 1, id_editorial: 1, id_categoria: 1, anio_publicacion: 2008 };
      mockSupabaseClient.single.mockResolvedValue({ data: { id_libro: 1, ...dto }, error: null });
      const result = await service.create(dto as any);
      expect(result.id_libro).toBe(1);
    });

    it('should crash on database failure', async () => {
      mockSupabaseClient.single.mockResolvedValue({ data: null, error: { message: 'ISBN Duplicado' } });
      await expect(service.create({ titulo: 'Fail' } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      mockSupabaseClient.select.mockResolvedValue({ data: [{ titulo: 'Book 1' }], error: null });
      const result = await service.findAll();
      expect(result.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      mockSupabaseClient.single.mockResolvedValue({ data: { id_libro: 5 }, error: null });
      const result = await service.findOne(5);
      expect(result.id_libro).toBe(5);
    });

    it('should throw NotFoundException if missing', async () => {
      mockSupabaseClient.single.mockResolvedValue({ data: null, error: { message: 'Not Found' } });
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update fields properly', async () => {
      mockSupabaseClient.single.mockResolvedValue({ data: { id_libro: 1, titulo: 'Cambiado' }, error: null });
      const result = await service.update(1, { titulo: 'Cambiado' });
      expect(result.titulo).toBe('Cambiado');
    });
  });

  describe('remove', () => {
    it('should delete accurately', async () => {
      mockSupabaseClient.eq.mockResolvedValue({ data: null, error: null });
      const result = await service.remove(1);
      expect(result.deleted).toBe(true);
    });
  });
});