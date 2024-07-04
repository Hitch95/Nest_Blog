import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Role } from '../user.entity';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
