import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';


export enum TaskStatus {
  OPEN = 'OPEN',
  FAILED = 'FAILED',
  COMPLETE = 'COMPLETE',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column()
  description: string;

  @Column()
  number: number;

  @Column()
  createDate: string;

  @Column({
    nullable: true,
  })
  comment: string;

  @ManyToOne(() => User)
  user: User;
}
