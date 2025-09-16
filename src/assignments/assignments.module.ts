import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './assignment.entity';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Assignment]), UsersModule, TasksModule],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
})
export class AssignmentsModule {}
