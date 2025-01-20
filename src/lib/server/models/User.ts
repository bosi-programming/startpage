import { hashPassword } from "../utils/auth/password";
import { userRepository } from "../repositories";
import { User as UserEntity } from "../entities/User"
import { BaseModel } from "./BaseModel";

class User extends BaseModel<UserEntity> {
  public async createUser(email: string, password: string): Promise<[{ errorCode: number, errorMessage: string } | null, UserEntity | null]> {
    const [, user] = await this.getUserByEmail(email);
    const hasUser = Boolean(user)
    if (hasUser) {
      return [{ errorCode: 400, errorMessage: "User already exist" }, null];
    }
    const passwordHash = await hashPassword(password);
    return await this.create({ email, password: passwordHash });
  }
  public async getUserByEmail(email: string): Promise<[{ errorCode: number, errorMessage: string } | null, UserEntity | null]> {
    try {
    const user = await this.repository.findOneBy({ email });
    if (!user) {
      return [{ errorCode: 400, errorMessage: "User not found" }, null];
    }
    return [null, user];
    } catch {
      return [{ errorCode: 500, errorMessage: "Server error" }, null];
    }
  }
}

export const userModel = new User(userRepository);
