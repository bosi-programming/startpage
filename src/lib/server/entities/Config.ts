import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Page } from "./Page";
import { User } from "./User";

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  user: User;

  @OneToMany(() => Page, (page) => page.config, { cascade: true })
  pages: Page[];
}
