import { Module, Global } from '@nestjs/common'; // 👈 Global makes it easy to use everywhere
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditLog } from './entities/audit-log.entity';

@Global() // 👈 Important: This lets Auth/Tasks modules use it without extra imports
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService], // Export so others can use it
})
export class AuditModule {}