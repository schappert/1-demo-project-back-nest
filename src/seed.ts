// src/seed.ts
import { AppDataSource } from "./data-source";
import { User } from "./users/user.entity";
import { Task } from "./tasks/task.entity";
import { Assignment } from "./assignments/assignment.entity";

async function main() {
  // Initialisation TypeORM
  await AppDataSource.initialize();
  console.log("DataSource initialized");

  // Création utilisateurs
  const userRepo = AppDataSource.getRepository(User);
  const users = [
    userRepo.create({ name: "Alice", username: "alice01", email: "alice@example.com", password: "test" }),
    userRepo.create({ name: "Bob", username: "bob01", email: "bob@example.com", password: "test" }),
  ];
  await userRepo.save(users);
  console.log("Users saved");

  // Création tâches
  const taskRepo = AppDataSource.getRepository(Task);
  const tasks = [
    taskRepo.create({ title: "Task A" }),
    taskRepo.create({ title: "Task B" }),
  ];
  await taskRepo.save(tasks);
  console.log("Tasks saved");

  // Création assignments
  const assignmentRepo = AppDataSource.getRepository(Assignment);
  const assignments = [
    assignmentRepo.create({ user: users[0], task: tasks[0] }),
    assignmentRepo.create({ user: users[1], task: tasks[1] }),
  ];
  await assignmentRepo.save(assignments);
  console.log("Assignments saved");

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
