import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { UsersService } from '../users/users.service';
import { TasksService } from '../tasks/tasks.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private assignmentsService: AssignmentsService,
    private usersService: UsersService,
    private tasksService: TasksService,
  ) {}

  @Get()
  getAll() {
    return this.assignmentsService.findAll();
  }

  @Post()
  async assign(@Body() body: { userId: number; taskId: number }) {
    const user = await this.usersService.findOneById(body.userId);
    const task = await this.tasksService.findOneById(body.taskId);

    if (!user || !task) return { error: 'Utilisateur ou tâche introuvable' };

    return this.assignmentsService.assignTask(user, task);
  }

}
