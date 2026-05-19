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
            const dto = { id_usuario: 1, id_ejemplar: 10, fecha_prestamo: '2026-05-19', estado_prestamo: 'ACTIVO' };
            mockSupabaseClient.single.mockResolvedValue({ data: { id_prestamo: 1, ...dto }, error: null });
            const result = await service.create(dto as any);
            expect(result.id_prestamo).toBe(1);
        });

        it('should throw BadRequestException if insertion fails', async () => {
            mockSupabaseClient.single.mockResolvedValue({ data: null, error: { message: 'No exemplars available' } });
            await expect(service.create({ id_usuario: 1 } as any)).rejects.toThrow(BadRequestException);
        });
    });

    describe('update', () => {
        it('should modify loan states (e.g., DEVUELTO)', async () => {
            mockSupabaseClient.single.mockResolvedValue({ data: { id_prestamo: 1, estado_prestamo: 'DEVUELTO' }, error: null });
            const result = await service.update(1, { estado_prestamo: 'DEVUELTO' });
            expect(result.estado_prestamo).toBe('DEVUELTO');
        });
    });
});