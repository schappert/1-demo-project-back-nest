import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { Assignment } from './assignments/assignment.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'tooba',
      password: 'loulou',
      database: 'demo_app',
      entities: [User, Task, Assignment],
      synchronize: false,
      logging: true, // logge les requêtes
    }),
    UsersModule,
    TasksModule,
    AssignmentsModule,
    AuthModule,
  ],
})
export class AppModule {}
