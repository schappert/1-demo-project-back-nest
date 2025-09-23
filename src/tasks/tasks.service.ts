import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  // Retourne toutes les tâches
  async findAll(): Promise<Task[]> {
    return this.repo.find({ relations: ['assignments'] });
  }

  async findOneById(id: number): Promise<Task> {
    const task = await this.repo.findOne({ where: { id }, relations: ['assignments'] });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }


  // Création d'une tâche
  async create(title: string, description?: string): Promise<Task> {
    const task = this.repo.create({ title, description });
    return this.repo.save(task);
  }

  // Mise à jour d'une tâche
  async update(id: number, attrs: Partial<Pick<Task, 'title'>>): Promise<Task> {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    Object.assign(task, attrs);
    return this.repo.save(task);
  }

  // Suppression d'une tâche
  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Task not found');
  }
}
