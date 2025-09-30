import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';

describe('AssignmentsController', () => {
  let controller: AssignmentsController;
  let assignmentsService: jest.Mocked<AssignmentsService>;
  let usersService: jest.Mocked<UsersService>;
  let tasksService: jest.Mocked<TasksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentsController],
      providers: [
        {
          provide: AssignmentsService,
          useValue: {
            findAll: jest.fn(),
            assignTask: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
        {
          provide: TasksService,
          useValue: {
            findOneById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AssignmentsController>(AssignmentsController);
    assignmentsService = module.get(AssignmentsService);
    usersService = module.get(UsersService);
    tasksService = module.get(TasksService);
  });

  it('should return all assignments', async () => {
    const mockAssignments = [{ id: 1, userId: 1, taskId: 2 }];
    assignmentsService.findAll.mockResolvedValue(mockAssignments as any);

    const result = await controller.getAll();
    expect(result).toEqual(mockAssignments);
    expect(assignmentsService.findAll).toHaveBeenCalled();
  });

  it('should assign a task when user and task exist', async () => {
    const mockUser = { id: 1, name: 'Alice' } as any;
    const mockTask = { id: 2, title: 'Task A' } as any;
    const mockAssignment = { id: 1, user: mockUser, task: mockTask } as any;

    usersService.findOneById.mockResolvedValue(mockUser);
    tasksService.findOneById.mockResolvedValue(mockTask);
    assignmentsService.assignTask.mockResolvedValue(mockAssignment);

    const result = await controller.assign({ userId: 1, taskId: 2 });

    expect(result).toEqual(mockAssignment);
    expect(usersService.findOneById).toHaveBeenCalledWith(1);
    expect(tasksService.findOneById).toHaveBeenCalledWith(2);
    expect(assignmentsService.assignTask).toHaveBeenCalledWith(mockUser, mockTask);
  });

  it('should return error if user is not found', async () => {
    usersService.findOneById.mockResolvedValue(null);
    tasksService.findOneById.mockResolvedValue({ id: 2 } as any);

    const result = await controller.assign({ userId: 99, taskId: 2 });

    expect(result).toEqual({ error: 'Utilisateur ou tâche introuvable' });
    expect(usersService.findOneById).toHaveBeenCalledWith(99);
    expect(tasksService.findOneById).toHaveBeenCalledWith(2);
    expect(assignmentsService.assignTask).not.toHaveBeenCalled();
  });

  it('should return error if task is not found', async () => {
    usersService.findOneById.mockResolvedValue({ id: 1 } as any);
    tasksService.findOneById.mockResolvedValue(undefined as any);

    const result = await controller.assign({ userId: 1, taskId: 999 });

    expect(result).toEqual({ error: 'Utilisateur ou tâche introuvable' });
    expect(usersService.findOneById).toHaveBeenCalledWith(1);
    expect(tasksService.findOneById).toHaveBeenCalledWith(999);
    expect(assignmentsService.assignTask).not.toHaveBeenCalled();
  });
});
