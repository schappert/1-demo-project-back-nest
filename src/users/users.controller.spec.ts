import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {
    // Mock du service
    service = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: service },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        { id: 1, name: 'Alice', username: 'alice', email: 'alice@test.com', password: 'pass' },
      ];
      service.findAll.mockResolvedValue(result);

      expect(await controller.getAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const payload = { name: 'Bob', username: 'bob', email: 'bob@test.com', password: 'pass' };
      const createdUser = { id: 2, ...payload };
      service.create.mockResolvedValue(createdUser);

      expect(await controller.create(payload)).toBe(createdUser);
      expect(service.create).toHaveBeenCalledWith(payload.name, payload.username, payload.email, payload.password);
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const id = '1';
      const payload = { name: 'Alice Updated' };
      const updatedUser = { id: 1, name: 'Alice Updated', username: 'alice', email: 'alice@test.com', password: 'pass' };
      service.update.mockResolvedValue(updatedUser);

      expect(await controller.update(id, payload)).toBe(updatedUser);
      expect(service.update).toHaveBeenCalledWith(1, payload);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const id = '1';
      service.remove.mockResolvedValue(undefined);

      await expect(controller.delete(id)).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
