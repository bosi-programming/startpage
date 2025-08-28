import { TypeOrm } from './database';
import { Config } from './entities/Config';
import { User } from './entities/User';

const db = await TypeOrm.getDb();
if (!db) {
  throw new Error('Problem initializing database');
}

export const userRepository = db.getRepository(User);
export const configRepository = db.getRepository(Config);
