import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
    let controller: RolesController;
    let service: RolesService;

    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [RolesController],
            providers: [{ provide: RolesService, useValue: mockService }],
        }).compile();

        controller = module.get<RolesController>(RolesController);
        service = module.get<RolesService>(RolesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { nombre: 'Admin', max_prestamos: 5, dias_prestamo: 30 };
            jest.spyOn(service, 'create').mockResolvedValueOnce({ id_rol: 1, ...dto } as any);
            const result = await controller.create(dto as any);
            expect(result.id_rol).toBe(1);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all roles', async () => {
            const data = [{ id_rol: 1 }];
            jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
            const result = await controller.findAll();
            expect(result).toEqual(data);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one role', async () => {
            const data = { id_rol: 1 };
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
            const result = await controller.findOne(1);
            expect(result).toEqual(data);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update role', async () => {
            const dto = { max_prestamos: 10 };
            const updated = { id_rol: 1, ...dto };
            jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
            const result = await controller.update(1, dto as any);
            expect(result).toEqual(updated);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should delete role', async () => {
            const deleted = { deleted: true };
            jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted as any);
            const result = await controller.remove(1);
            expect(result).toEqual(deleted);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
