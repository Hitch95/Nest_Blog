import { Expose } from 'class-transformer';
import { Role } from '../user.entity';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: Role;
}
