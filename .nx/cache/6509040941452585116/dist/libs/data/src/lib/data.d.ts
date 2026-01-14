export declare enum UserRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
    VIEWER = "VIEWER"
}
export interface Organization {
    id: string;
    name: string;
    parentId?: string | null;
}
export interface User {
    id: string;
    email: string;
    password?: string;
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
