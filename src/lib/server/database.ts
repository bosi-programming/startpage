import "reflect-metadata"
import { User } from "@/lib/server/entities/User"
import { DataSource } from "typeorm"
import { Config } from "./entities/Config";

export class TypeOrm {
  private static instance: Promise<DataSource | null> | null = null;

  private constructor() {
    // Private constructor to prevent external instantiation
  }

  public static getDb(): Promise<DataSource | null> {
    if (!TypeOrm.instance) {
      TypeOrm.instance = new DataSource({
        type: "sqlite",
        database: "database",
        entities: [User, Config],
        synchronize: true,
        logging: false,
      })
        .initialize()
        .then((fulfilled) => {
          console.info('Data Source has been initialized!');
          return fulfilled;
        })
        .catch((err) => {
          console.error('Error during Data Source initialization', err);
          return null;
        });
    }
    return TypeOrm.instance
  }
}

const db = await TypeOrm.getDb()
console.log(db)
export const userRepository = db?.getRepository(User)
const users = await userRepository?.find()
console.log(users)
