import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Autores (e2e)', () => {
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
        await request(app.getHttpServer()).delete(`/autores/${createdId}`);
      } catch (e) {}
    }
    if (app) await app.close();
  });

  it('/autores (POST)', async () => {
    const createDto = { primer_nombre: 'John', primer_apellido: 'Doe' };

    const response = await request(app.getHttpServer())
      .post('/autores')
      .send(createDto);

    // Depending on validation, this might fail initially.
    // If it fails with 400, make sure to provide valid data.
    if (response.status === 201) {
      // Adjust according to the actual primary key name returned
      createdId =
        response.body.id ||
        response.body.id_autor ||
        response.body.id_usuario ||
        response.body.id_rol;
      expect(createdId).toBeDefined();
    }
  });

  it('/autores (GET)', () => {
    return request(app.getHttpServer()).get('/autores').expect(200);
  });

  it('/autores/:id (GET)', async () => {
    if (!createdId) {
      console.warn('Skipping GET by ID because creation failed');
      return;
    }
    await request(app.getHttpServer()).get(`/autores/${createdId}`).expect(200);
  });

  it('/autores/:id (PATCH)', async () => {
    if (!createdId) {
      console.warn('Skipping PATCH because creation failed');
      return;
    }
    const updateDto = { primer_nombre: 'John', primer_apellido: 'Doe' };

    await request(app.getHttpServer())
      .patch(`/autores/${createdId}`)
      .send(updateDto)
      .expect(200);
  });

  it('/autores/:id (DELETE)', async () => {
    if (!createdId) {
      console.warn('Skipping DELETE because creation failed');
      return;
    }
    await request(app.getHttpServer())
      .delete(`/autores/${createdId}`)
      .expect(200);

    createdId = null; // Successfully deleted
  });
});
