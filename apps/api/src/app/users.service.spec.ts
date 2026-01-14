import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuditService } from './audit.service';

// 1. Mock the Repository
const mockUserRepository = {
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((user) => Promise.resolve({ id: '123', ...user })),
  findOne: jest.fn().mockImplementation((condition) => {
    // Simulate finding a user by email
    if (condition?.where?.email === 'test@example.com') {
      return Promise.resolve({ id: '1', email: 'test@example.com', role: 'ADMIN' });
    }
    return null;
  }),
  find: jest.fn().mockResolvedValue([]),
};

// 2. Mock Audit Service
const mockAuditService = {
  log: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: AuditService,
          useValue: mockAuditService, // 👈 Provide the missing dependency
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});