import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let controller: AppController;
    let service: AppService;

    beforeEach(async () => {
        const mockService = {
            getHello: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [{ provide: AppService, useValue: mockService }],
        }).compile();

        controller = module.get<AppController>(AppController);
        service = module.get<AppService>(AppService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getHello', () => {
        it('should return a greeting message', async () => {
            const message = 'Hello World!';
            jest.spyOn(service, 'getHello').mockReturnValueOnce(message);
            const result = controller.getHello();
            expect(result).toEqual(message);
            expect(service.getHello).toHaveBeenCalled();
        });
    });
});
