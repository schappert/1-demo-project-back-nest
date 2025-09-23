import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

describe('AssignmentsService', () => {
  let service: AssignmentsService;
  let repo: jest.Mocked<Repository<Assignment>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentsService,
        {
          provide: getRepositoryToken(Assignment),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AssignmentsService>(AssignmentsService);
    repo = module.get(getRepositoryToken(Assignment));
  });

  describe('findAll', () => {
    it('should return all assignments with relations', async () => {
      const mockAssignments = [
        { id: 1, user: { id: 1, name: 'Alice' }, task: { id: 2, title: 'Task A' } },
      ] as any;

      repo.find.mockResolvedValue(mockAssignments);

      const result = await service.findAll();

      expect(result).toEqual(mockAssignments);
      expect(repo.find).toHaveBeenCalledWith({ relations: ['user', 'task'] });
    });
  });

  describe('assignTask', () => {
    it('should create and save an assignment', async () => {
      const mockUser = { id: 1, name: 'Alice' } as User;
      const mockTask = { id: 2, title: 'Task A' } as Task;
      const mockAssignment = { id: 123, user: mockUser, task: mockTask } as Assignment;

      repo.create.mockReturnValue(mockAssignment);
      repo.save.mockResolvedValue(mockAssignment);

      const result = await service.assignTask(mockUser, mockTask);

      expect(result).toEqual(mockAssignment);
      expect(repo.create).toHaveBeenCalledWith({ user: mockUser, task: mockTask });
      expect(repo.save).toHaveBeenCalledWith(mockAssignment);
    });
  });
});
