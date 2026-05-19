import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { EjemplaresService } from './ejemplares.service';
import { SupabaseService } from '../supabase/supabase.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EjemplaresService', () => {
    let service: EjemplaresService;
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
                EjemplaresService,
                { provide: SupabaseService, useValue: { client: mockSupabaseClient } },
            ],
        }).compile();

        service = module.get<EjemplaresService>(EjemplaresService);
    });

    describe('findOne', () => {
        it('should throw NotFoundException if ejemplar is null', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: null, error: null });
            await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
        });

        it('should return data if found', async () => {
            mockSupabaseClient.single.mockResolvedValueOnce({ data: { id_ejemplar: 1 }, error: null });
            const result = await service.findOne(1);
            expect(result.id_ejemplar).toBe(1);
        });
    });
});