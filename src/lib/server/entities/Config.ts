import { Column, Entity, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Page } from "./Page";
import { User } from "./User";

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, user => user.config, { eager: true })
  user: Relation<User>;

  @Column('json')
  pages: Page[];
}
