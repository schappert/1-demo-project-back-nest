import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Assignment } from '../assignments/assignment.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @OneToMany(() => Assignment, (assignment) => assignment.task)
  assignments: Assignment[];
}
