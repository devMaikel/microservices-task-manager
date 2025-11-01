import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ length: 50 })
  field!: string;

  @Column({ type: 'text' })
  oldValue!: string;

  @Column({ type: 'text' })
  newValue!: string;

  @Column({ type: 'uuid' })
  taskId!: string;

  @ManyToOne(() => Task, (task) => task.history)
  @JoinColumn({ name: 'taskId' })
  task!: Task;

  @CreateDateColumn()
  changedAt!: Date;
}
