import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/user.entity';
import { Task } from './tasks/task.entity';
import { Assignment } from './assignments/assignment.entity';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'tooba',
      password: 'loulou',
      database: 'demo_app',
      entities: [User, Task, Assignment, Product],
      synchronize: false,
      logging: true, // logge les requêtes
    }),
    UsersModule,
    TasksModule,
    AssignmentsModule,
    AuthModule,
    DashboardModule,
    ProductsModule
  ],
})
export class AppModule {}
