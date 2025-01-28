import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => Page, (page) => page.columns)
  @JoinColumn()
  page: Page

  @ManyToOne(() => SitesColumn, (column) => column.subcolumns)
  @JoinColumn()
  superColumn?: SitesColumn

  @OneToMany(() => SitesColumn, (column) => column.superColumn, { cascade: true, eager: true })
  @JoinColumn()
  subcolumns?: SitesColumn[];
}

