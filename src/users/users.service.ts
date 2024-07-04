import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(CreateUserDto: CreateUserDto) {
    const user = this.userRepository.create(CreateUserDto);
    return this.userRepository.save(user);
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async find(email: string) {
    const users = this.userRepository.findBy({ email });
    return users;
  }

  async findAll(): Promise<User[]> {
    const users = this.userRepository.find();
    return users;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    // Object.assign(user, attr);
    // return this.userRepository.save(user);
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
    return `User ${id} deleted`;
  }

  async addWarning(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.warningReceived = (user.warningReceived || 0) + 1;

    if (user.warningReceived >= 2 && !user.suspensionStartDate) {
      user.suspensionStartDate = new Date().toISOString();
    }

    await this.userRepository.save(user);
    return user;
  }

  async giveWarning(user: User): Promise<void> {
    user.warningReceived += 1;

    if (user.warningReceived >= 2) {
      user.suspensionStartDate = new Date().toISOString();
    }

    await this.userRepository.save(user);
  }
}
