import { DataSource } from "typeorm";
import { User } from "./users/user.entity";
import { Task } from './tasks/task.entity';
import { Assignment } from './assignments/assignment.entity';

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "tooba",
  password: "loulou",
  database: "demo_app",
  entities: [User, Task, Assignment],
  synchronize: false,
  migrations: ["src/migrations/*.ts"],
});
