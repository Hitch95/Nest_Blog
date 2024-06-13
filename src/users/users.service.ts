import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  async findOne(id: string) {
    if (!id) {
      return null;
    }
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  find(email: string) {
    const users = this.userRepository.findBy({ email });
    return users;
  }

  findAll() {
    const users = this.userRepository.find();
    return users;
  }

  async update(id: string, attr: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attr);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
    return `User ${id} deleted`;
  }
}
