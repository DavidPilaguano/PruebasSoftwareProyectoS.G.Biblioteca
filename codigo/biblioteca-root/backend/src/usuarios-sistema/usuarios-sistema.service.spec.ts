import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
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
});
