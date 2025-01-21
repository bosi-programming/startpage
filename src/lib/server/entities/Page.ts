import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SitesColumn } from "./Column";
import { Config } from "./Config";
import { User } from "./User";

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.pages)
  user: User;

  @Column('text', { nullable: false })
  title: string;

  @OneToMany(() => SitesColumn, (column) => column.page, { cascade: true, eager: true })
  @JoinColumn()
  columns: SitesColumn[];

  @ManyToOne(() => Config, (config) => config.pages)
  config: Config;
}

