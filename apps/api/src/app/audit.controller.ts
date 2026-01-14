import { Controller, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '@nestjs/passport'; // Or your custom JwtAuthGuard

@Controller('audit-log') // 👈 Matches the PDF requirement GET /audit-log
@UseGuards(AuthGuard('jwt')) 
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(@Request() req) {
    const role = req.user.role;
    // Strictly enforce Admin/Owner access
    if (role !== 'ADMIN' && role !== 'OWNER') {
      throw new ForbiddenException('Only Admins can view audit logs');
    }
    return this.auditService.findAll();
  }
}