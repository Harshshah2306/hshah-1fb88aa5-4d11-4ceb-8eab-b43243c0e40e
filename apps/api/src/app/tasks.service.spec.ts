import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AuditService } from './audit.service';

// 1. Mock the Task Repository
const mockTaskRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((task) => Promise.resolve({ id: Date.now(), ...task })),
  find: jest.fn().mockImplementation(() => Promise.resolve([])),
  findOne: jest.fn().mockImplementation((id) => Promise.resolve({ id, title: 'Test Task' })),
  delete: jest.fn().mockImplementation(() => Promise.resolve({ affected: 1 })),
};

// 2. Mock the Audit Service
const mockAuditService = {
  log: jest.fn(),
  createAudit: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: typeof mockTaskRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 👇 TEST 1: Create a Task (Requires User)
  describe('create', () => {
    it('should create and save a task', async () => {
      const createDto = { title: 'New Task', status: 'OPEN', assignedToId: 'user-2' };
      const mockUser = { id: 'user-1', email: 'admin@test.com', role: 'ADMIN' };

      // Pass BOTH arguments
      const result = await service.create(createDto as any, mockUser as any);

      expect(result.title).toEqual('New Task');
      expect(repository.save).toHaveBeenCalled();
    });
  });

  // 👇 TEST 2: Find All Tasks (Requires User)
  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedTasks = [{ id: 1, title: 'Test' }];
      repository.find.mockResolvedValue(expectedTasks);

      // 🟢 FIX: Create a fake user here too
      const mockUser = { id: 'user-1', email: 'admin@test.com', role: 'ADMIN' };

      // Pass the user to findAll
      const result = await service.findAll(mockUser as any);

      expect(result).toEqual(expectedTasks);
      expect(repository.find).toHaveBeenCalled();
    });
  });
});