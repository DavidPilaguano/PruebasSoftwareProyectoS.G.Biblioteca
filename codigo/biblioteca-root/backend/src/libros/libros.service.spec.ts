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
            const dto = { titulo: 'Clean Code', isbn: '123', id_autor: 1, id_editorial: 1, id_categoria: 1, anio_publicacion: 2008 };
            mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_libro: 1, ...dto }, error: null });
            const result = await service.create(dto as any);
            expect(result.id_libro).toBe(1);
        });

        it('should throw BadRequestException when missing id_categoria', async () => {
            await expect(service.create({ titulo: 'Fail', id_editorial: 1 } as any)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException when missing id_editorial', async () => {
            await expect(service.create({ titulo: 'Fail', id_categoria: 1 } as any)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException on database failure', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });
            await expect(service.create({ titulo: 'Fail', id_editorial: 1, id_categoria: 1 } as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all books', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({ data: [{ id_libro: 1 }], error: null });
            const result = await service.findAll();
            expect(result.length).toBe(1);
        });

        it('should return empty array when data is null', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({ data: null, error: null });
            const result = await service.findAll();
            expect(result).toEqual([]);
        });

        it('should throw BadRequestException if findAll fails', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({ data: null, error: { message: 'Error' } });
            await expect(service.findAll()).rejects.toThrow(BadRequestException);
        });
    });

    describe('findOne', () => {
        it('should return a book if found', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_libro: 5 }, error: null });
            const result = await service.findOne(5);
            expect(result.id_libro).toBe(5);
        });

        it('should throw NotFoundException if book missing', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: null });
            await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException on error', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } });
            await expect(service.findOne(99)).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should update fields properly', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_libro: 1, titulo: 'Cambiado' }, error: null });
            const result = await service.update(1, { titulo: 'Cambiado' } as any);
            expect(result.titulo).toBe('Cambiado');
        });

        it('should throw NotFoundException if book to update does not exist', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: null });
            await expect(service.update(1, { titulo: 'Error' } as any)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if update fails', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'Update Error' } });
            await expect(service.update(1, { titulo: 'Error' } as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should delete accurately', async () => {
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: null });
            const result = await service.remove(1);
            expect(result.deleted).toBe(true);
        });

        it('should throw BadRequestException if delete fails', async () => {
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: { message: 'Delete Error' } });
            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
        });
    });

    describe('getDashboardStats', () => {
        it('should return dashboard statistics', async () => {
            mockSupabaseClient.from = jest.fn().mockReturnThis();
            mockSupabaseClient.select = jest.fn().mockResolvedValueOnce({ 
                data: null, 
                count: 5, 
                error: null 
            }).mockResolvedValueOnce({ 
                data: null, 
                count: 10, 
                error: null 
            }).mockResolvedValueOnce({ 
                data: null, 
                count: 15, 
                error: null 
            });
            const result = await service.getDashboardStats();
            expect(result).toEqual({ libros: 5, usuarios: 10, ejemplares: 15 });
        });

        it('should return zeros when no data', async () => {
            mockSupabaseClient.from = jest.fn().mockReturnThis();
            mockSupabaseClient.select = jest.fn().mockResolvedValueOnce({ 
                data: null, 
                count: null, 
                error: null 
            }).mockResolvedValueOnce({ 
                data: null, 
                count: null, 
                error: null 
            }).mockResolvedValueOnce({ 
                data: null, 
                count: null, 
                error: null 
            });
            const result = await service.getDashboardStats();
            expect(result).toEqual({ libros: 0, usuarios: 0, ejemplares: 0 });
        });

        it('should catch errors gracefully', async () => {
            mockSupabaseClient.from = jest.fn().mockReturnThis();
            mockSupabaseClient.select = jest.fn().mockRejectedValueOnce(new Error('DB Error'));
            const result = await service.getDashboardStats();
            expect(result).toBeUndefined();
        });
    });
});