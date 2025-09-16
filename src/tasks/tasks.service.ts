import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  findAll() {
    return this.repo.find();
  }

  findOneById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(title: string) {
    const task = this.repo.create({ title });
    return this.repo.save(task);
  }
}
