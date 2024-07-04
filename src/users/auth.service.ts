import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { promisify } from 'util';

import { Role, User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

import { randomBytes, scrypt as _scrypt } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(
    username: string,
    email: string,
    password: string,
    role?: Role,
  ): Promise<User> {
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    if (!role) {
      const existingUser = await this.usersService.findAll();
      role = existingUser.length === 0 ? Role.Admin : Role.Visitor;
    }

    const CreateUserDto: CreateUserDto = {
      username,
      email,
      password: result,
      role,
    };

    const user = this.usersService.create(CreateUserDto);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // Get the salt of the persisted password in the DB
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad user/password combination');
    }
    return user;
  }
}
