import { Test, TestingModule } from '@nestjs/testing';
import { AutoresController } from './autores.controller';
import { AutoresService } from './autores.service';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('AutoresController', () => {
    let controller: AutoresController;

    const mockService = {
        findAll: jest.fn().mockResolvedValue([]),
        findOne: jest.fn().mockResolvedValue({ id_autor: 1 }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AutoresController],
            providers: [{ provide: AutoresService, useValue: mockService }],
        }).compile();

        controller = module.get<AutoresController>(AutoresController);
    });

    it('should call findAll', async () => {
        await controller.findAll();
        expect(mockService.findAll).toHaveBeenCalled();
    });
});