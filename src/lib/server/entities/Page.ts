import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SitesColumn } from "./Column";
import { Config } from "./Config";

@Entity()
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @OneToMany(() => SitesColumn, (column) => column.page, { cascade: true })
  columns: SitesColumn[];

  @ManyToOne(() => Config, (config) => config.pages)
  config: Config;
}

