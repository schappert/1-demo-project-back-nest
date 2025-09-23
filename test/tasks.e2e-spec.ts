import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';

import { Task } from '../src/tasks/task.entity';
import { TasksModule } from '../src/tasks/tasks.module';
import { User } from '../src/users/user.entity';
import { Assignment } from '../src/assignments/assignment.entity';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TasksModule,
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
    // Reset DB avant chaque test
    await dataSource.getRepository(Task).clear();
  });

  it('GET /tasks → empty array initially', async () => {
    const res = await request(app.getHttpServer()).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /tasks → create a new task', async () => {
    const taskPayload = { title: 'First task', description: 'Do something' };

    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send(taskPayload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(taskPayload);
    expect(res.body.id).toBeDefined();
  });

  it('GET /tasks/:id → retrieve one task', async () => {
    const repo = dataSource.getRepository(Task);
    const saved = await repo.save({ title: 'Sample', description: 'Test' });

    const res = await request(app.getHttpServer()).get(`/tasks/${saved.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: saved.id,
      title: 'Sample',
      description: 'Test',
    });
  });

  it('PUT /tasks/:id → update a task', async () => {
    const repo = dataSource.getRepository(Task);
    const saved = await repo.save({ title: 'Old title' });

    const res = await request(app.getHttpServer())
      .put(`/tasks/${saved.id}`)
      .send({ title: 'Updated title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated title');
  });

  it('DELETE /tasks/:id → delete a task', async () => {
    const repo = dataSource.getRepository(Task);
    const saved = await repo.save({ title: 'To delete' });

    const res = await request(app.getHttpServer()).delete(`/tasks/${saved.id}`);
    expect(res.status).toBe(200);

    const findTask = await repo.findOne({ where: { id: saved.id } });
    expect(findTask).toBeNull();
  });
});
