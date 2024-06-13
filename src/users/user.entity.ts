import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  OneToMany,
} from 'typeorm';
import { Article } from '../articles/article.entity';

export enum Role {
  Admin = 'admin',
  DataAnalyst = 'dataAnalyst',
  Moderator = 'moderator',
  Visitor = 'visitor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ type: 'varchar', length: 12 })
  role: Role;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @Column({ default: 0 })
  warningReceived: number;

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ' + this.id);
  }
}
