import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  ManyToOne,
  BeforeInsert,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ArticleComment } from './comment/comment.entity';

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

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @OneToMany(() => ArticleComment, (comment) => comment.article, {
    cascade: true,
  })
  @JoinColumn()
  comments: ArticleComment[];

  @BeforeInsert()
  setCreationDate() {
    this.creationDate = new Date();
  }

  @AfterInsert()
  logInsert() {
    console.log('Inserted article with id: ' + this.id);
  }
}
