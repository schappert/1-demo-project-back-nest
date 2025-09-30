import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
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

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'Alice', email: 'a@b.com', username: 'alice', password: 'pass' }] as User[];
      repo.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(repo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'a@b.com' } as User;
      repo.findOne.mockResolvedValue(user);

      const result = await service.findOneByEmail('a@b.com');
      expect(result).toEqual(user);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'a@b.com' } });
    });
  });

  describe('create', () => {
    it('should create and hash password', async () => {
      const dto = { name: 'Bob', username: 'bob', email: 'bob@b.com', password: 'secret' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      repo.create.mockReturnValue({ ...dto, password: hashedPassword } as any);
      repo.save.mockResolvedValue({ id: 1, ...dto, password: hashedPassword } as User);

      const result = await service.create({
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: dto.password,
      });

      expect(result).toHaveProperty('id', 1);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user partially', async () => {
      const user = { id: 1, name: 'Alice', email: 'a@b.com', username: 'alice', password: 'pass' } as User;
      repo.findOne.mockResolvedValue(user);
      repo.save.mockResolvedValue({ ...user, name: 'Updated' });

      const result = await service.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repo.save).toHaveBeenCalledWith({ ...user, name: 'Updated' });
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.update(999, { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      repo.delete.mockResolvedValue({ affected: 1 } as any);
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if user not found', async () => {
      repo.delete.mockResolvedValue({ affected: 0 } as any);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
