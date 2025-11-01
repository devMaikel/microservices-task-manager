import { Exclude } from 'class-transformer';
import { Task } from '../../task/entities/task.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('task_comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  content!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  taskId!: string;

  @ManyToOne(() => Task, (task) => task.comments)
  @JoinColumn({ name: 'taskId' })
  task!: Task;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
