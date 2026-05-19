import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriaController } from './auditoria.controller';
import { AuditoriaService } from './auditoria.service';

describe('AuditoriaController', () => {
    let controller: AuditoriaController;
    let service: AuditoriaService;

    beforeEach(async () => {
        const mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuditoriaController],
            providers: [{ provide: AuditoriaService, useValue: mockService }],
        }).compile();

        controller = module.get<AuditoriaController>(AuditoriaController);
        service = module.get<AuditoriaService>(AuditoriaService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call service.create', async () => {
            const dto = { tabla_afectada: 'usuario', id_registro: 1, accion: 'INSERT' };
            jest.spyOn(service, 'create').mockResolvedValueOnce({ id_auditoria: 1, ...dto } as any);
            const result = await controller.create(dto as any);
            expect(result.id_auditoria).toBe(1);
            expect(service.create).toHaveBeenCalledWith(dto);
        });
    });

    describe('findAll', () => {
        it('should return all records', async () => {
            const data = [{ id_auditoria: 1 }];
            jest.spyOn(service, 'findAll').mockResolvedValueOnce(data as any);
            const result = await controller.findAll();
            expect(result).toEqual(data);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should return one record', async () => {
            const data = { id_auditoria: 1 };
            jest.spyOn(service, 'findOne').mockResolvedValueOnce(data as any);
            const result = await controller.findOne(1);
            expect(result).toEqual(data);
            expect(service.findOne).toHaveBeenCalledWith(1);
        });
    });

    describe('update', () => {
        it('should update record', async () => {
            const dto = { accion: 'DELETE' };
            const updated = { id_auditoria: 1, ...dto };
            jest.spyOn(service, 'update').mockResolvedValueOnce(updated as any);
            const result = await controller.update(1, dto as any);
            expect(result).toEqual(updated);
            expect(service.update).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remove', () => {
        it('should delete record', async () => {
            const deleted = { deleted: true };
            jest.spyOn(service, 'remove').mockResolvedValueOnce(deleted as any);
            const result = await controller.remove(1);
            expect(result).toEqual(deleted);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
    });
});
