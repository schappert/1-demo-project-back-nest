import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

type MockRepo<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TasksService', () => {
  let service: TasksService;
  let repo: MockRepo<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repo = module.get(getRepositoryToken(Task));
  });

  it('should return all tasks', async () => {
    const tasks = [{ id: 1, title: 'Task 1' }] as Task[];
    repo.find!.mockResolvedValue(tasks);

    const result = await service.findAll();
    expect(result).toEqual(tasks);
    expect(repo.find).toHaveBeenCalledWith({ relations: ['assignments'] });
  });

  it('should return one task by id', async () => {
    const task = { id: 1, title: 'Task 1' } as Task;
    repo.findOne!.mockResolvedValue(task);

    const result = await service.findOneById(1);
    expect(result).toEqual(task);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['assignments'] });
  });

  it('should throw NotFoundException if task not found', async () => {
    repo.findOne!.mockResolvedValue(undefined);
    await expect(service.findOneById(42)).rejects.toThrow(NotFoundException);
  });

  it('should create and save a task', async () => {
    const task = { id: 1, title: 'New Task' } as Task;
    repo.create!.mockReturnValue(task);
    repo.save!.mockResolvedValue(task);

    const result = await service.create('New Task', 'desc');
    expect(result).toEqual(task);
    expect(repo.create).toHaveBeenCalledWith({ title: 'New Task', description: 'desc' });
    expect(repo.save).toHaveBeenCalledWith(task);
  });

  it('should update a task', async () => {
    const task = { id: 1, title: 'Old Title' } as Task;
    repo.findOne!.mockResolvedValue(task);
    repo.save!.mockResolvedValue({ ...task, title: 'Updated' });

    const result = await service.update(1, { title: 'Updated' });
    expect(result.title).toBe('Updated');
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException when updating non-existent task', async () => {
    repo.findOne!.mockResolvedValue(undefined);
    await expect(service.update(42, { title: 'Updated' })).rejects.toThrow(NotFoundException);
  });

  it('should delete a task', async () => {
    repo.delete!.mockResolvedValue({ affected: 1 });
    await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when deleting non-existent task', async () => {
    repo.delete!.mockResolvedValue({ affected: 0 });
    await expect(service.remove(42)).rejects.toThrow(NotFoundException);
  });
});
