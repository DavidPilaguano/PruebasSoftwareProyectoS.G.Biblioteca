import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
    let service: RolesService;
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
                RolesService,
                { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
            ],
        }).compile();

        service = module.get<RolesService>(RolesService);
    });

    describe('create', () => {
        it('should throw BadRequestException if max_prestamos is missing', async () => {
            await expect(service.create({ dias_prestamo: 14 } as any)).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if dias_prestamo is missing', async () => {
            await expect(service.create({ max_prestamos: 5 } as any)).rejects.toThrow(BadRequestException);
        });

        it('should create and return role data', async () => {
            const newRole = { id_rol: 1, max_prestamos: 5, dias_prestamo: 14 };
            mockSupabaseClient.single.mockResolvedValueOnce({ data: newRole, error: null });
            const result = await service.create({ max_prestamos: 5, dias_prestamo: 14 });
            expect(result.id_rol).toBe(1);
        });

        it('should throw BadRequestException on supabase error', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });
            await expect(service.create({ max_prestamos: 5, dias_prestamo: 14 })).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should throw BadRequestException on error', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({ data: null, error: { message: 'DB Error' } });
            await expect(service.findAll()).rejects.toThrow(BadRequestException);
        });

        it('should return array of roles', async () => {
            const roles = [{ id_rol: 1, nombre: 'Admin' }];
            mockSupabaseClient.select.mockResolvedValueOnce({ data: roles, error: null });
            const result = await service.findAll();
            expect(result).toEqual(roles);
        });

        it('should return empty array when data is null', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({ data: null, error: null });
            const result = await service.findAll();
            expect(result).toEqual([]);
        });
    });

    describe('findOne', () => {
        it('should throw NotFoundException if role is not found', async () => {
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

        it('should return role data', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({
                data: { id_rol: 1, nombre: 'Admin' },
                error: null,
            });
            const result = await service.findOne(1);
            expect(result.nombre).toBe('Admin');
        });
    });

    describe('update', () => {
        it('should throw BadRequestException on supabase error', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: { message: 'Update failed' } });
            await expect(service.update(1, { max_prestamos: 10 })).rejects.toThrow(BadRequestException);
        });

        it('should update and return role data', async () => {
            const updated = { id_rol: 1, max_prestamos: 10 };
            mockSupabaseClient.single.mockResolvedValueOnce({ data: updated, error: null });
            const result = await service.update(1, { max_prestamos: 10 });
            expect(result.max_prestamos).toBe(10);
        });
    });

    describe('remove', () => {
        it('should throw BadRequestException on supabase error', async () => {
            mockSupabaseClient.delete.mockReturnThis();
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: null, error: { message: 'Delete failed' } });
            await expect(service.remove(1)).rejects.toThrow(BadRequestException);
        });

        it('should delete role and return success', async () => {
            mockSupabaseClient.delete.mockReturnThis();
            mockSupabaseClient.eq.mockResolvedValueOnce({ data: {}, error: null });
            const result = await service.remove(1);
            expect(result.deleted).toBe(true);
        });
    });
});
