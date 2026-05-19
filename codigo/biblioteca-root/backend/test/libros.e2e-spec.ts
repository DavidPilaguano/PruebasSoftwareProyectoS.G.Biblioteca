import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Libros (e2e)', () => {
  let app: INestApplication;
  let createdId: number | null = null;
  let creationFailed = false; 
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    if (createdId && app) {
      try {
        await request(app.getHttpServer()).delete(`/libros/${createdId}`);
      } catch (e) {
        console.warn(`[Cleanup] No se pudo borrar el recurso ${createdId}`);
      }
    }
    if (app) await app.close();
  });

  it('/libros (POST) - Debe crear un libro', async () => {
    const createDto = {
      titulo: 'Test Book E2E',
      id_categoria: 1,
      id_editorial: 1,
      isbn: '1234567890',
    };

    const response = await request(app.getHttpServer())
      .post('/libros')
      .send(createDto);

    if (response.status !== 201) {
      console.error('--- ERROR CRÍTICO EN POST /libros ---');
      console.error('Status:', response.status);
      console.error('Body:', JSON.stringify(response.body, null, 2));
      creationFailed = true;
    }

    expect(response.status).toBe(201);
    createdId = response.body.id || response.body.id_libro;
    expect(createdId).toBeDefined();
  });

  it('/libros (GET) - Debe listar libros', async () => {
    const response = await request(app.getHttpServer()).get('/libros');
    expect(response.status).toBe(200);
  });

  it('/libros/:id (GET) - Debe obtener libro por ID', async () => {
    if (creationFailed || !createdId) {
      console.warn('Skipping GET by ID: POST falló previamente');
      return;
    }
    
    const response = await request(app.getHttpServer()).get(`/libros/${createdId}`);
    expect(response.status).toBe(200);
  });

  it('/libros/:id (PATCH) - Debe actualizar libro', async () => {
    if (creationFailed || !createdId) {
      console.warn('Skipping PATCH: POST falló previamente');
      return;
    }

    const updateDto = {
      titulo: 'Test Book Updated',
      id_categoria: 1,
      id_editorial: 1,
      isbn: '1234567890',
    };

    const response = await request(app.getHttpServer())
      .patch(`/libros/${createdId}`)
      .send(updateDto);

    expect(response.status).toBe(200);
  });

  it('/libros/:id (DELETE) - Debe eliminar libro', async () => {
    if (creationFailed || !createdId) {
      console.warn('Skipping DELETE: POST falló previamente');
      return;
    }

    const response = await request(app.getHttpServer()).delete(`/libros/${createdId}`);
    expect(response.status).toBe(200);
    createdId = null;
  });
});