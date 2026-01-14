import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@hshah-1fb88aa5-4d11-4ceb-8eab-b43243c0e40e/auth'; // Import from your lib
import { UsersModule } from './users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { AuthController } from './auth.controller';
import { TasksModule } from './tasks.module';
import {Task} from './entities/task.entity';
import { AuditModule } from './audit.module';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Task, AuditLog], // Explicitly list entities if autoLoad fails
      synchronize: true,
    }),
    UsersModule,
    AuthModule, 
    TasksModule, 
    AuditModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}