import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { User } from './entities/user.entity';
import { AuditService } from './audit.service';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private auditService: AuditService
  ) {}

  // Create a task for the specific user
  async create(createTaskDto: any, user: User) {
  const task = new Task();
  task.title = createTaskDto.title;
  task.status = 'OPEN';
  task.user = user; // The creator
  // Check if an assignee was passed
  if (createTaskDto.assignedToId) {
    // We just create a dummy object with the ID. 
    // TypeORM is smart enough to link it.
    task.assignedTo = { id: createTaskDto.assignedToId } as User;
  }
  const savedTask = await this.tasksRepository.save(task);
  await this.auditService.log(user, 'TASK_CREATED', `Created task: ${savedTask.title}`);
  return savedTask;
}

  async findAll(user: User) {
    return this.tasksRepository.find({
      relations: ['user', 'assignedTo'],
      order: { id: 'DESC' }
    });
  }


  async update(id: number, updateTaskDto: any) {
    // If the data is empty or undefined, don't touch the database.
    if (!updateTaskDto || Object.keys(updateTaskDto).length === 0) {
      console.log('Update skipped: No data provided');
      return { message: 'No changes made' };
    }

    // 2. Proceed with update only if we have data
    await this.tasksRepository.update(id, updateTaskDto);

    return this.tasksRepository.findOne({ where: { id } });
  }

  async remove(id: number, user:User) {
    const task = await this.tasksRepository.findOne({ where: { id } });

    await this.tasksRepository.delete(id);

    // Log the deletion
    if (task) {
      await this.auditService.log(user, 'TASK_DELETED', `Deleted task ID: ${id} (${task.title})`);
    }
  }
  
}