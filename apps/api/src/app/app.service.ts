import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AuthService } from 'libs/auth/src/lib/auth.service'; // Import Auth Service
import { UserRole } from '@hshah-1fb88aa5-4d11-4ceb-8eab-b43243c0e40e/data';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private authService: AuthService) {}

  async onApplicationBootstrap() {
    // 1. Check if our test user exists by trying to validate them
    const user = await this.authService.validateUser('test@example.com', 'password123');
    const user2 = await this.authService.validateUser('abc@gmail.com', 'abc');
    // 2. If no user found, create one!
    
    if (!user) {
      console.log('🌱 Seeding database with default user...');
      try {
        await this.authService.register({
          email: 'test@example.com',
          password: 'password123',
          organizationId: 'org-default',
          role: UserRole.OWNER
        });
        console.log('✅ User created! Email: test@example.com | Password: password123');
      } catch (e) {
        // If register fails (e.g. user already exists but password differs), just ignore
        console.log('ℹ️ User might already exist.');
      }
    }
    if (!user2) {
      console.log('🌱 Seeding database with default admin user...');
      try {
        await this.authService.register({
          email: 'abc@gmail.com',
          password: 'abc',
          organizationId: 'org-default',
          role: UserRole.ADMIN
        });
        console.log('✅ User created! Email: abc@gmail.com');
      } catch (e) {
        // If register fails (e.g. user already exists but password differs), just ignore
        console.log('ℹ️ Admin User might already exist.');
      }
    }
  }

  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}