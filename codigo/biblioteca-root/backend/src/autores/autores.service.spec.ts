import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AutoresService } from './autores.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AutoresService', () => {
    let service: AutoresService;
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
        }as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AutoresService,
                { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
            ],
        }).compile();

        service = module.get<AutoresService>(AutoresService);
    });

    describe('create', () => {
        it('should create an author successfully', async () => {
            // Usamos los campos correctos que pide tu servicio
            const dto = { primer_nombre: 'Gabriel', primer_apellido: 'García' };
            mockSupabaseClient.single.mockResolvedValueOnce({
                data: { id_autor: 1, ...dto },
                error: null,
            });

            const result = await service.create(dto as any);
            expect(result.id_autor).toBe(1);
        });

        it('should throw BadRequestException if creation fails', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({
                data: null,
                error: { message: 'Error DB' },
            });
            await expect(
                service.create({ primer_nombre: 'A', primer_apellido: 'B' } as any),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('findOne', () => {
        it('should return author if found', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({
                data: { id_autor: 1 },
                error: null,
            });
            const result = await service.findOne(1);
            expect(result.id_autor).toBe(1);
        });

        it('should throw NotFoundException if author missing (null data)', async () => {
            // Ajuste: si data es null, el servicio debe lanzar el error
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

    describe('findAll', () => {
        it('should return all authors', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({
                data: [{ id_autor: 1 }],
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

    describe('update', () => {
        it('should update author correctly', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({
                data: { id_autor: 1, primer_nombre: 'Nuevo' },
                error: null,
            });
            const result = await service.update(1, { primer_nombre: 'Nuevo' } as any);
            expect(result.primer_nombre).toBe('Nuevo');
        });

        it('should throw NotFoundException if author does not exist', async () => {
            // Ajuste: Mockeamos data como null para disparar la excepción
            mockSupabaseClient.single.mockResolvedValueOnce({
                data: null,
                error: null,
            });
            await expect(
                service.update(1, { primer_nombre: 'Test' } as any),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException on db error', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({
                data: null,
                error: { message: 'Update failed' },
            });
            await expect(
                service.update(1, { primer_nombre: 'Test' } as any),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should remove author correctly', async () => {
            mockSupabaseClient.delete.mockReturnThis();
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: null });
            const result = await service.remove(1);
            expect(result.deleted).toBe(true);
        });

        it('should throw BadRequestException on delete error', async () => {
            mockSupabaseClient.delete.mockReturnThis();
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: { message: 'Delete failed' } });
            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
        });
    });
});
