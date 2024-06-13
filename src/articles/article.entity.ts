import { Entity, Column, PrimaryGeneratedColumn, AfterInsert } from 'typeorm';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  author: string;

  @Column()
  date: Date;

  @Column()
  tag: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted article with id: ' + this.id);
  }
}
