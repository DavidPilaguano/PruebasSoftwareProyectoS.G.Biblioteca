import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { EjemplaresController } from './ejemplares.controller';
import { EjemplaresService } from './ejemplares.service';

describe('EjemplaresController', () => {
    let controller: EjemplaresController;
    let service: EjemplaresService;

    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [EjemplaresController],
            providers: [{ provide: EjemplaresService, useValue: mockService }],
        }).compile();

        controller = module.get<EjemplaresController>(EjemplaresController);
        service = module.get<EjemplaresService>(EjemplaresService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { id_libro: 1, codigo_barra: '12345' };
            jest.spyOn(service, 'create').mockResolvedValueOnce({ id_ejemplar: 1, ...dto } as any);
            const result = await controller.create(dto as any);
            expect(result.id_ejemplar).toBe(1);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all ejemplares', async () => {
            const data = [{ id_ejemplar: 1 }];
            jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
            const result = await controller.findAll();
            expect(result).toEqual(data);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one ejemplar', async () => {
            const data = { id_ejemplar: 1 };
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
            const result = await controller.findOne('1');
            expect(result).toEqual(data);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update ejemplar', async () => {
            const dto = { estado: 'DISPONIBLE' };
            const updated = { id_ejemplar: 1, ...dto };
            jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
            const result = await controller.update('1', dto as any);
            expect(result).toEqual(updated);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should delete ejemplar', async () => {
            const deleted = { deleted: true };
            jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted as any);
            const result = await controller.remove('1');
            expect(result).toEqual(deleted);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
