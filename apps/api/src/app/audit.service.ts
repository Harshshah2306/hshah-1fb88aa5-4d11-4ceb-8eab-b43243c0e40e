import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(user: User, action: string, details?: string) {
    const logEntry = this.auditRepository.create({
      user,
      action,
      details,
    });
    return this.auditRepository.save(logEntry);
  }

  async findAll() {
    return this.auditRepository.find({
      order: { timestamp: 'DESC' }, // Newest first
    });
  }
}