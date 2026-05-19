import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasService } from './categorias.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CategoriasService', () => {
    let service: CategoriasService;
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
                CategoriasService,
                { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
            ],
        }).compile();

        service = module.get<CategoriasService>(CategoriasService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return all categories', async () => {
            mockSupabaseClient.select.mockResolvedValueOnce({ data: [{ id_categoria: 1 }], error: null });
            const result = await service.findAll();
            expect(result.length).toBe(1);
        });
    });

    describe('findOne', () => {
        it('should throw NotFoundException if category does not exist', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: null });
            await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a category', async () => {
            const dto = { nombre: 'Ficción' };
            mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_categoria: 1, ...dto }, error: null });
            const result = await service.create(dto as any);
            expect(result.id_categoria).toBe(1);
        });
    });
});