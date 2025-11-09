import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ length: 50 })
  type!: string;

  @Column({ type: 'uuid', nullable: true })
  taskId?: string | null;

  @Column({ type: 'uuid', nullable: true })
  commentId?: string | null;

  @Column({ type: 'text' })
  message!: string;

  @Column({ default: false })
  read!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
