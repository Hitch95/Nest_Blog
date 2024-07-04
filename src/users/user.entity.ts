import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Article } from '../articles/article.entity';
import { ArticleComment } from 'src/articles/comment/comment.entity';

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

  @Column()
  username: string;

  @Column({ type: 'varchar', length: 12 })
  role: Role;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => ArticleComment, (comment) => comment.author)
  comments: ArticleComment[];

  @Column({ default: 0 })
  warningReceived: number;

  @Column({ type: 'text', nullable: true })
  suspensionStartDate: string;

  @BeforeInsert()
  @BeforeUpdate()
  handleDates() {
    if (
      this.suspensionStartDate &&
      typeof this.suspensionStartDate === 'object'
    ) {
      this.suspensionStartDate = (
        this.suspensionStartDate as Date
      ).toISOString();
    }
  }

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ' + this.id);
  }
}
