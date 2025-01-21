import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Config } from "./Config";
import { Page } from "./Page";
import { SitesColumn } from "./Column";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  email: string;

  @Column('text', { nullable: false })
  password: string;

  @OneToOne(() => Config)
  @JoinColumn()
  config?: Config;

  @OneToMany(() => Page, (page) => page.user, { cascade: true })
  pages?: Page[];

  @OneToMany(() => SitesColumn, (column) => column.user, { cascade: true })
  columns?: SitesColumn[];
}


