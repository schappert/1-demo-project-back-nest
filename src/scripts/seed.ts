// src/scripts/seed.ts
import { AppDataSource } from "../data-source";
import { User } from "../users/user.entity";
import { Task } from "../tasks/task.entity";
import { Assignment } from "../assignments/assignment.entity";
import * as bcrypt from "bcryptjs";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log("✅ DataSource initialized");

    const userRepo = AppDataSource.getRepository(User);
    const taskRepo = AppDataSource.getRepository(Task);
    const assignmentRepo = AppDataSource.getRepository(Assignment);

    // --- Génération utilisateurs ---
    const userCount = 5;
    const users: User[] = [];
    for (let i = 1; i <= userCount; i++) {
      const user = userRepo.create({
        name: `User ${i}`,
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: await bcrypt.hash("password", 10),
      });
      users.push(user);
    }
    await userRepo.save(users);
    console.log(`✅ ${userCount} users saved`);

    // --- Génération tâches ---
    const taskCount = 10;
    const tasks: Task[] = [];
    for (let i = 1; i <= taskCount; i++) {
      const task = taskRepo.create({
        title: `Task ${i}`,
        description: `Description for task ${i}`,
      });
      tasks.push(task);
    }
    await taskRepo.save(tasks);
    console.log(`✅ ${taskCount} tasks saved`);

    // --- Assignments aléatoires ---
    const assignments: Assignment[] = [];
    for (const task of tasks) {
      const shuffledUsers = users.sort(() => 0.5 - Math.random());
      const assignees = shuffledUsers.slice(0, Math.floor(Math.random() * 3) + 1);
      for (const user of assignees) {
        assignments.push(assignmentRepo.create({ user, task }));
      }
    }
    await assignmentRepo.save(assignments);
    console.log(`✅ ${assignments.length} assignments saved`);

    await AppDataSource.destroy();
    console.log("🏁 Dynamic seeding finished");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

bootstrap();
