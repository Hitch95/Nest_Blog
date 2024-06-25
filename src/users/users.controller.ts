import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  NotFoundException,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UpdateUserDto } from './dtos/update-user.dto';
// import { Serialize } from '../interceptors/serializeInterceptor';
// import { UserDto } from './dtos/user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from './decorator/role.decorator';
import { Role, User } from './user.entity';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './decorator/current-user.decorator';

@Controller('auth')
// @Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    console.log(user);
    session.userId = user.id;
    session.userRole = user.role;
    console.log(session);
    return plainToClass(UserDto, user);
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    console.log(user);
    session.userId = user.id;
    console.log(session);
    session.userRole = user.role;
    console.log(session);
    return plainToClass(UserDto, user);
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    console.log(session);
    session.userId = null;
    console.log(session);
    session.userRole = null;
    console.log(session);
  }

  @Get('/:id')
  // @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  async findById(@Param('id') id: string) {
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async findAll(@CurrentUser() currentUser: User): Promise<UserDto[]> {
    console.log('Current User:', currentUser);
    const users = await this.usersService.findAll();
    return users.map((user) => plainToClass(UserDto, user));
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async removeUser(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RoleGuard)
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = this.usersService.update(id, body);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
