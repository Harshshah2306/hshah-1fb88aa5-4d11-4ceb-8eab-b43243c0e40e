import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// Replace the import below with your actual library name found in tsconfig.base.json
// It usually looks like @<workspace-name>/data
import { UserRole } from '@hshah-1fb88aa5-4d11-4ceb-8eab-b43243c0e40e/data'; 
import {Task} from './task.entity'
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // We will store the Hashed password here

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.VIEWER
  })
  role: UserRole;

  @Column()
  organizationId: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}