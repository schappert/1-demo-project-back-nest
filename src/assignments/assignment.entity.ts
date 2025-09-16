import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.assignments)
  user: User;

  @ManyToOne(() => Task, (task) => task.assignments)
  task: Task;
}
