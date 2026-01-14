import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'libs/auth/src/lib/jwt-auth.guard'; // Ensure you have this guard
import { User } from './entities/user.entity';

@Controller('tasks')
@UseGuards(JwtAuthGuard) // Protects routes so only logged-in users can access
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: any) {
    if (req.user.role === 'VIEWER') {
    throw new ForbiddenException('Viewers are not allowed to create tasks.');
  }
    // req.user is added by the AuthGuard
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: any) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) { // Inject @Request()
  // SECURITY CHECK
  if (req.user.role === 'VIEWER') {
    throw new ForbiddenException('Viewers are not allowed to delete tasks.');
  }

  return this.tasksService.remove(+id, req.user); // (Or this.tasksService.delete(id))
  }
}