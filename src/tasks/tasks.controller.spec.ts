import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn(),
            findOneById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of tasks', async () => {
      const tasks: Task[] = [
        { id: 1, title: 'Task 1', description: 'Desc 1' } as Task,
      ];
      service.findAll.mockResolvedValue(tasks);

      const result = await controller.getAll();
      expect(result).toEqual(tasks);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should return a single task by id', async () => {
      const task = { id: 1, title: 'Task 1' } as Task;
      service.findOneById.mockResolvedValue(task);

      const result = await controller.getOne('1');
      expect(result).toEqual(task);
      expect(service.findOneById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new task', async () => {
      const newTask = { id: 1, title: 'New Task', description: 'Desc' } as Task;
      service.create.mockResolvedValue(newTask);

      const result = await controller.create({
        title: 'New Task',
        description: 'Desc',
      });
      expect(result).toEqual(newTask);
      expect(service.create).toHaveBeenCalledWith('New Task', 'Desc');
    });
  });

  describe('update', () => {
    it('should update and return the task', async () => {
      const updatedTask = { id: 1, title: 'Updated Task' } as Task;
      service.update.mockResolvedValue(updatedTask);

      const result = await controller.update('1', { title: 'Updated Task' });
      expect(result).toEqual(updatedTask);
      expect(service.update).toHaveBeenCalledWith(1, { title: 'Updated Task' });
    });
  });

  describe('delete', () => {
    it('should call remove with the correct id', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.delete('1');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
