import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { Role } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const usersService = app.get(UsersService);

  const users: CreateUserDto[] = [
    { email: 'admin@example.com', password: 'password', role: Role.Admin },
    {
      email: 'moderator@example.com',
      password: 'password',
      role: Role.Moderator,
    },
    {
      email: 'dataAnalyst@example.com',
      password: 'password',
      role: Role.DataAnalyst,
    },
    { email: 'visitor@example.com', password: 'password', role: Role.Visitor },
  ];

  for (const user of users) {
    console.log(`Checking existence of user: ${user.email}`);
    const existingUser = await usersService.find(user.email);
    console.log(`Existing user data: ${JSON.stringify(existingUser)}`);
    if (!existingUser.length) {
      console.log(`Creating user: ${user.email} with role: ${user.role}`);
      await authService.signup(user.email, user.password, user.role);
      console.log(`Created user: ${user.email} with role: ${user.role}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  await app.close();
}

bootstrap();
