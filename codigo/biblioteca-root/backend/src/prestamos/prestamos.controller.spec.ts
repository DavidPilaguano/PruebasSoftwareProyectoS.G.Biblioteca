import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';

describe('PrestamosController', () => {
    let controller: PrestamosController;
    let service: PrestamosService;

    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [PrestamosController],
            providers: [{ provide: PrestamosService, useValue: mockService }],
        }).compile();

        controller = module.get<PrestamosController>(PrestamosController);
        service = module.get<PrestamosService>(PrestamosService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { id_usuario: 1, id_ejemplar: 10, fecha_devolucion_esperada: '2026-06-19', estado: 'ACTIVO', id_usuario_sistema: 1 };
            jest.spyOn(service, 'create').mockResolvedValueOnce({ id_prestamo: 1, ...dto } as any);
            const result = await controller.create(dto as any);
            expect(result.id_prestamo).toBe(1);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all prestamos', async () => {
            const data = [{ id_prestamo: 1 }];
            jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
            const result = await controller.findAll();
            expect(result).toEqual(data);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one prestamo', async () => {
            const data = { id_prestamo: 1 };
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
            const result = await controller.findOne(1);
            expect(result).toEqual(data);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update prestamo', async () => {
            const dto = { estado: 'DEVUELTO' };
            const updated = { id_prestamo: 1, ...dto };
            jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
            const result = await controller.update(1, dto as any);
            expect(result).toEqual(updated);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should delete prestamo', async () => {
            const deleted = { id_prestamo: 1 };
            jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted as any);
            const result = await controller.remove(1);
            expect(result).toEqual(deleted);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
