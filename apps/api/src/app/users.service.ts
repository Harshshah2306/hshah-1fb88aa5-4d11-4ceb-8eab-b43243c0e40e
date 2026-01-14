import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditService } from './audit.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private auditService: AuditService
  ) {}

  async create(createUserDto: any) { // Use 'any' or your DTO type
    // We will hash the password in the Controller or Service before saving
    const newUser = this.usersRepository.create(createUserDto);
    await this.auditService.log(null, `Created user: ${newUser}`);
    return this.usersRepository.save(newUser);
  }

  findAll() {
    return this.usersRepository.find({
      // We select only specific fields to avoid sending the password
      select: ['id', 'email', 'role', 'organizationId'] 
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }
}
