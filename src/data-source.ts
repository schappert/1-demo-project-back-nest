import { DataSource } from "typeorm";
import { Task } from './tasks/task.entity';
import { User } from "./users/user.entity";
import { Assignment } from './assignments/assignment.entity';
import { Product } from './products/product.entity';

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "tooba",
  password: "loulou",
  database: "demo_app",
  // entities: [User, Task, Assignment, Product],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  migrations: ["src/migrations/*.ts"],
});
