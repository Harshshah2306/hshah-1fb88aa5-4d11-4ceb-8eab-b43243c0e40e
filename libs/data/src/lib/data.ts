export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
}
export class CreateUserDto {
  email!: string;
  password!: string;
  organizationId?: string; // Optional (denoted by ?)
  role?: string;           // Optional (denoted by ?)
}

export interface Organization {
  id: string;
  name: string;
  parentId?: string | null; // For the 2-level hierarchy requirement
}

export interface User {
  id: string;
  email: string;
  password?: string; // Optional because we often exclude it in responses
  role: UserRole;
  organizationId: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: string;
  organizationId: string;
  createdAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}