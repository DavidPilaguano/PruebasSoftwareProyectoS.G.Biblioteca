import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosService } from './prestamos.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PrestamosService', () => {
    let service: PrestamosService;
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
                PrestamosService,
                { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
            ],
        }).compile();

        service = module.get<PrestamosService>(PrestamosService);
    });

    describe('create', () => {
        it('should issue a loan correctly', async () => {
            const dto = { id_usuario: 1, id_ejemplar: 10, fecha_devolucion_esperada: '2026-06-19', estado: 'ACTIVO', id_usuario_sistema: 1 };
            mockSupabaseClient.single.mockResolvedValue({ data: { id_prestamo: 1, ...dto }, error: null });
            const result = await service.create(dto as any);
            expect(result.id_prestamo).toBe(1);
        });

        it('should throw BadRequestException if insertion fails', async () => {
            mockSupabaseClient.single.mockResolvedValue({ data: null, error: { message: 'No exemplars available' } });
            await expect(service.create({ id_usuario: 1 } as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all loans', async () => {
            const loans = [{ id_prestamo: 1 }];
            mockSupabaseClient.select.mockResolvedValueOnce({ data: loans, error: null });
            const result = await service.findAll();
            expect(result).toEqual(loans);
        });

        it('should throw BadRequestException on error', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });
            await expect(service.findAll()).rejects.toThrow(BadRequestException);
        });
    });

    describe('findOne', () => {
        it('should return a loan if found', async () => {
            mockSupabaseClient.single.mockResolvedValue({ data: { id_prestamo: 1, estado: 'ACTIVO' }, error: null });
            const result = await service.findOne(1);
            expect(result.id_prestamo).toBe(1);
        });

        it('should throw NotFoundException if not found', async () => {
            mockSupabaseClient.single.mockResolvedValue({ data: null, error: null });
            await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should modify loan states (e.g., DEVUELTO)', async () => {
            mockSupabaseClient.single.mockResolvedValue({ data: { id_prestamo: 1, estado: 'DEVUELTO' }, error: null });
            const result = await service.update(1, { estado: 'DEVUELTO' });
            expect(result.estado).toBe('DEVUELTO');
        });

        it('should throw BadRequestException on error', async () => {
            mockSupabaseClient.single.mockResolvedValue({ data: null, error: { message: 'Update failed' } });
            await expect(service.update(1, { estado: 'DEVUELTO' })).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should delete a loan', async () => {
            mockSupabaseClient.delete.mockReturnThis();
            mockSupabaseClient.eq.mockReturnThis();
            mockSupabaseClient.select.mockReturnThis();
            mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_prestamo: 1 }, error: null });
            const result = await service.remove(1);
            expect(result.id_prestamo).toBe(1);
        });

        it('should throw BadRequestException on delete error', async () => {
            mockSupabaseClient.delete.mockReturnThis();
            mockSupabaseClient.eq.mockReturnThis();
            mockSupabaseClient.select.mockReturnThis();
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'Delete failed' } });
            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
        });
    });
});