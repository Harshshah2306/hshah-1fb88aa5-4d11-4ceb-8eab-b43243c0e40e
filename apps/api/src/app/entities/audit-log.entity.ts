import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string; // e.g., 'CREATE_TASK', 'DELETE_TASK', 'LOGIN'

  @Column({ nullable: true })
  details: string; // e.g., 'Task "Fix Bug" created'

  @ManyToOne(() => User, { eager: true }) 
  user: User; // Who did it?

  @CreateDateColumn()
  timestamp: Date; // When did it happen?
}