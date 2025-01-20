import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Page } from "./Page";

@Entity()
export class SitesColumn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @Column('simple-json')
  sites: { name: string, url: string }[]

  @ManyToOne(() => Page, (page) => page.columns, { cascade: true})
  page: Page
}


