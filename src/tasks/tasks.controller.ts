import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOneById(Number(id));
  }

  @Post()
  create(@Body() body: { title: string; description?: string }) {
    return this.tasksService.create(body.title, body.description);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { title?: string }): Promise<Task> {
    return this.tasksService.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(Number(id));
  }
}
