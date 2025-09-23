import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsModule } from '../src/assignments/assignments.module';
import { UsersModule } from '../src/users/users.module';
import { TasksModule } from '../src/tasks/tasks.module';
import { DataSource } from 'typeorm';
import { User } from '../src/users/user.entity';
import { Task } from '../src/tasks/task.entity';
import { Assignment } from '../src/assignments/assignment.entity';

describe('AssignmentsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TasksModule,
        AssignmentsModule,
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
    await dataSource.getRepository(Assignment).clear();
    await dataSource.getRepository(User).clear();
    await dataSource.getRepository(Task).clear();
  });

  it('GET /assignments → empty array initially', async () => {
    const res = await request(app.getHttpServer()).get('/assignments');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /assignments → assign task to user', async () => {
    const userRepo = dataSource.getRepository(User);
    const taskRepo = dataSource.getRepository(Task);

    const user = await userRepo.save({ name: 'Alice', username: 'alice01', email: 'alice@example.com', password: 'secret' });
    const task = await taskRepo.save({ title: 'First task', description: 'Do something' });

    const res = await request(app.getHttpServer())
      .post('/assignments')
      .send({ userId: user.id, taskId: task.id });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      user: { id: user.id, name: 'Alice' },
      task: { id: task.id, title: 'First task' },
    });

    const assignment = await dataSource.getRepository(Assignment).findOne({
      where: { id: res.body.id },
      relations: ['user', 'task'],
    });
    expect(assignment).toBeDefined();
    expect(assignment.user.id).toBe(user.id);
    expect(assignment.task.id).toBe(task.id);
  });

  it('POST /assignments → fail if user or task not found', async () => {
    const res = await request(app.getHttpServer())
      .post('/assignments')
      .send({ userId: 999, taskId: 888 });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Task not found', // ou 'User not found' si user introuvable en premier
    });
  });
});
