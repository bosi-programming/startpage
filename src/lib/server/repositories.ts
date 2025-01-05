import { TypeOrm } from "./database"
import { User } from "./entities/User"

const db = await TypeOrm.getDb()
if (!db) {
  throw new Error("Problem initializing database")
}

export const userRepository = db.getRepository(User)

