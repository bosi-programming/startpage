import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Config } from "./Config";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  email: string;

  @Column('text', { nullable: false })
  password: string;

  @OneToOne(() => Config, (config) => config.user, { cascade: true })
  @JoinColumn()
  config?: Relation<Config>;

  configId?: number;
}


