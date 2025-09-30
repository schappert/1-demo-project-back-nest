import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('Secure Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const mod: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = mod.createNestApplication();
    await app.init();

    dataSource = mod.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Réinitialisation complète de la DB avant chaque test
    await dataSource.synchronize(true);
  });

  it('login and access secure', async () => {
    // 1. créer un user
    await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'T', username: 't', email: 't@t', password: 'secret' })
      .expect(201);

    // 2. login
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 't', password: 'secret' })
      .expect(201);

    const token = login.body.access_token;

    // 3. accès protégé
    await request(app.getHttpServer())
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
