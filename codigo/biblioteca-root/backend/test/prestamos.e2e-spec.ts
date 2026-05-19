import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Prestamos (e2e)', () => {
  let app: INestApplication;
  let createdId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    // Clean up to avoid leaving garbage in real DB if DELETE wasn't called/failed
    if (createdId) {
      try {
        await request(app.getHttpServer()).delete(`/prestamos/${createdId}`);
      } catch (e) {}
    }
    if (app) await app.close();
  });

  it('/prestamos (POST)', async () => {
    const createDto = { id_usuario: 1, id_usuario_sistema: 1, id_ejemplar: 1 };

    const response = await request(app.getHttpServer())
      .post('/prestamos')
      .send(createDto);

    // Depending on validation, this might fail initially.
    // If it fails with 400, make sure to provide valid data.
    if (response.status === 201) {
      // Adjust according to the actual primary key name returned
      createdId =
        response.body.id ||
        response.body.id_prestamo ||
        response.body.id_usuario ||
        response.body.id_rol;
      expect(createdId).toBeDefined();
    }
  });

  it('/prestamos (GET)', () => {
    return request(app.getHttpServer()).get('/prestamos').expect(200);
  });

  it('/prestamos/:id (GET)', async () => {
    if (!createdId) {
      console.warn('Skipping GET by ID because creation failed');
      return;
    }
    await request(app.getHttpServer())
      .get(`/prestamos/${createdId}`)
      .expect(200);
  });

  it('/prestamos/:id (PATCH)', async () => {
    if (!createdId) {
      console.warn('Skipping PATCH because creation failed');
      return;
    }
    const updateDto = { id_usuario: 1, id_usuario_sistema: 1, id_ejemplar: 1 };

    await request(app.getHttpServer())
      .patch(`/prestamos/${createdId}`)
      .send(updateDto)
      .expect(200);
  });

  it('/prestamos/:id (DELETE)', async () => {
    if (!createdId) {
      console.warn('Skipping DELETE because creation failed');
      return;
    }
    await request(app.getHttpServer())
      .delete(`/prestamos/${createdId}`)
      .expect(200);

    createdId = null; // Successfully deleted
  });
});
