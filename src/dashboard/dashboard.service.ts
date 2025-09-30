import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';
import { Assignment } from '../assignments/assignment.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async getDashboardForUser(userId: number) {
    // exemple simple : counts
    const userRepo = this.dataSource.getRepository(User);
    const taskRepo = this.dataSource.getRepository(Task);
    const assignmentRepo = this.dataSource.getRepository(Assignment);

    const [users, tasks, assignments] = await Promise.all([
      userRepo.count(),
      taskRepo.count(),
      assignmentRepo.count(),
    ]);

    return { users, tasks, assignments, requestedFor: userId };
  }
}
