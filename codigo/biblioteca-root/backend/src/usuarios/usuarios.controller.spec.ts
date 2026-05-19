import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
    let controller: UsuariosController;
    let service: UsuariosService;

    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuariosController],
            providers: [{ provide: UsuariosService, useValue: mockService }],
        }).compile();

        controller = module.get<UsuariosController>(UsuariosController);
        service = module.get<UsuariosService>(UsuariosService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { cedula: '123', primer_nombre: 'Juan', primer_apellido: 'Pérez' };
            jest.spyOn(service, 'create').mockResolvedValueOnce({ id_usuario: 1, ...dto } as any);
            const result = await controller.create(dto as any);
            expect(result.id_usuario).toBe(1);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all usuarios', async () => {
            const data = [{ id_usuario: 1 }];
            jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
            const result = await controller.findAll();
            expect(result).toEqual(data);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one usuario', async () => {
            const data = { id_usuario: 1 };
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
            const result = await controller.findOne('1');
            expect(result).toEqual(data);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update usuario', async () => {
            const dto = { primer_nombre: 'Pedro' };
            const updated = { id_usuario: 1, ...dto };
            jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
            const result = await controller.update('1', dto as any);
            expect(result).toEqual(updated);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should delete usuario', async () => {
            const deleted = { deleted: true };
            jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted as any);
            const result = await controller.remove('1');
            expect(result).toEqual(deleted);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
