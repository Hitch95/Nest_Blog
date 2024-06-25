import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creationDate: Date;

  @Column({ nullable: true })
  dateOfUpdate: Date;

  @Column()
  tag: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  views: number;

  @Column({ nullable: true })
  comment: string;

  @Column({ default: false })
  isCommentApproved: boolean;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @BeforeInsert()
  setCreationDate() {
    this.creationDate = new Date();
  }

  @AfterInsert()
  logInsert() {
    console.log('Inserted article with id: ' + this.id);
  }
}
