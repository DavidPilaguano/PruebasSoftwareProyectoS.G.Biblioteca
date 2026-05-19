import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { EditorialesController } from './editoriales.controller';
import { EditorialesService } from './editoriales.service';

describe('EditorialesController', () => {
    let controller: EditorialesController;
    let service: EditorialesService;

    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [EditorialesController],
            providers: [{ provide: EditorialesService, useValue: mockService }],
        }).compile();

        controller = module.get<EditorialesController>(EditorialesController);
        service = module.get<EditorialesService>(EditorialesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { nombre: 'Editorial Nueva' };
            jest.spyOn(service, 'create').mockResolvedValueOnce({ id_editorial: 1, ...dto } as any);
            const result = await controller.create(dto as any);
            expect(result.id_editorial).toBe(1);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all editoriales', async () => {
            const data = [{ id_editorial: 1 }];
            jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
            const result = await controller.findAll();
            expect(result).toEqual(data);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one editorial', async () => {
            const data = { id_editorial: 1 };
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
            const result = await controller.findOne(1);
            expect(result).toEqual(data);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update editorial', async () => {
            const dto = { nombre: 'Editorial Actualizada' };
            const updated = { id_editorial: 1, ...dto };
            jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
            const result = await controller.update(1, dto as any);
            expect(result).toEqual(updated);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should delete editorial', async () => {
            const deleted = { deleted: true };
            jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted as any);
            const result = await controller.remove(1);
            expect(result).toEqual(deleted);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
