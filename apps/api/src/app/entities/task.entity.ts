import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'OPEN' })
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';

  // The Creator (Who made the ticket)
  @ManyToOne(() => User, (user) => user.tasks, { eager: true }) 
  user: User;

  // 👇 NEW: The Assignee (Who needs to do the work)
  @ManyToOne(() => User, { nullable: true, eager: true }) 
  assignedTo: User; 
}