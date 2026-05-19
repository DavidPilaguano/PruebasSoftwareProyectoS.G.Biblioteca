import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosSistemaController } from './usuarios-sistema.controller';
import { UsuariosSistemaService } from './usuarios-sistema.service';

describe('UsuariosSistemaController', () => {
    let controller: UsuariosSistemaController;
    let service: UsuariosSistemaService;

    const mockUsuariosService = {
        create: jest.fn<any>(),
        findAll: jest.fn<any>(),
        findOne: jest.fn<any>(),
        update: jest.fn<any>(),
        remove: jest.fn<any>(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuariosSistemaController],
            providers: [
                { provide: UsuariosSistemaService, useValue: mockUsuariosService },
            ],
        }).compile();

        controller = module.get<UsuariosSistemaController>(UsuariosSistemaController);
        service = module.get<UsuariosSistemaService>(UsuariosSistemaService);
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            mockUsuariosService.findAll.mockResolvedValue([{ id: 1, username: 'test' }]);
            const result = await controller.findAll();
            expect(result).toHaveLength(1);
        });
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { username: 'test', password: '123', primer_nombre: 'D', primer_apellido: 'P', rol_sistema: 'ADMIN' };
            mockUsuariosService.create.mockResolvedValue({ id: 1, ...dto });
            const result = await controller.create(dto as any);
            expect(result.id).toBe(1);
        });
    });
});