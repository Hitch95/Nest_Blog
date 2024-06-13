import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  OneToMany,
} from 'typeorm';
import { Article } from '../articles/article.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ' + this.id);
  }
}
