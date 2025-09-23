import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../src/users/users.module';
import { User } from '../src/users/user.entity';
import { DataSource } from 'typeorm';
import { Task } from '../src/tasks/task.entity';
import { Assignment } from '../src/assignments/assignment.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User, Task, Assignment],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean DB before each test
    await dataSource.getRepository(User).clear();
  });

  it('GET /users → empty array initially', async () => {
    const res = await request(app.getHttpServer()).get('/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /users → create a new user', async () => {
    const userPayload = {
      name: 'Alice',
      username: 'alice01',
      email: 'alice@example.com',
      password: 'secret',
    };

    const res = await request(app.getHttpServer())
      .post('/users')
      .send(userPayload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      name: 'Alice',
      username: 'alice01',
      email: 'alice@example.com',
    });
    expect(res.body.id).toBeDefined();
  });

  it('GET /users → array contains created user', async () => {
    // Create user first
    const userPayload = {
      name: 'Alice',
      username: 'alice01',
      email: 'alice@example.com',
      password: 'secret',
    };
    await request(app.getHttpServer()).post('/users').send(userPayload);

    const res = await request(app.getHttpServer()).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({
      name: 'Alice',
      username: 'alice01',
      email: 'alice@example.com',
    });
  });

  it('PUT /users/:id → update a user', async () => {
    const repo = dataSource.getRepository(User);
    const user = await repo.save({
      name: 'Bob',
      username: 'bob01',
      email: 'bob@example.com',
      password: 'secret',
    });

    const res = await request(app.getHttpServer())
      .put(`/users/${user.id}`)
      .send({ name: 'Bobby' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bobby');
  });

  it('DELETE /users/:id → delete a user', async () => {
    const repo = dataSource.getRepository(User);
    const user = await repo.save({
      name: 'Charlie',
      username: 'charlie01',
      email: 'charlie@example.com',
      password: 'secret',
    });

    const res = await request(app.getHttpServer()).delete(`/users/${user.id}`);
    expect(res.status).toBe(200);

    const findUser = await repo.findOne({ where: { id: user.id } });
    expect(findUser).toBeNull();
  });
});
