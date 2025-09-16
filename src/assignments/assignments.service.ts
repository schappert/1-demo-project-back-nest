import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './assignment.entity';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Injectable()
export class AssignmentsService {
  constructor(@InjectRepository(Assignment) private repo: Repository<Assignment>) {}

  findAll() {
    return this.repo.find({ relations: ['user', 'task'] });
  }

  assignTask(user: User, task: Task) {
    const assignment = this.repo.create({ user, task });
    return this.repo.save(assignment);
  }
}
