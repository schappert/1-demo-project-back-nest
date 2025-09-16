import { Controller, Get, Post, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll() {
    return this.tasksService.findAll();
  }

  @Post()
  create(@Body() body: { title: string }) {
    return this.tasksService.create(body.title);
  }
}
