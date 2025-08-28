import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Page } from './Page';
import { User } from './User';

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.config, {
    cascade: ['update', 'insert'],
  })
  user: User;

  @Column('integer')
  userId: number;

  @Column('json')
  pages: Page[];

  @Column('integer', { nullable: true })
  updatedAt?: number;
}
