import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Page } from "./Page";
import { User } from "./User";

@Entity()
export class SitesColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.columns)
  user: User;

  @Column('text', { nullable: false })
  title: string;

  @Column('simple-json')
  sites: { name: string, url: string }[]

  @ManyToOne(() => Page, (page) => page.columns, { cascade: true })
  @JoinColumn()
  page: Page
}

