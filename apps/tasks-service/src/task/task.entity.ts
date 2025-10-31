import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { TaskStatus, TaskPriority } from '../common/enums/task.enum';
import { Comment } from '../comment/comment.entity';
import { TaskHistory } from '../history/task-history.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'timestamp' })
  dueDate!: Date;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority!: TaskPriority;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @Column({ type: 'uuid' })
  creatorId!: string;

  @Column('uuid', { array: true, default: [] })
  assignedUserIds!: string[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments!: Comment[];

  @OneToMany(() => TaskHistory, (history) => history.task)
  history!: TaskHistory[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
