import { hashPassword } from "../auth/password";
import { userRepository } from "../repositories";
import { User as UserModel } from "../entities/User"

export class User {
  public static async createUser(email: string, password: string): Promise<[{ errorCode: number, errorMessage: string } | null, UserModel | null]> {
    const hasUser = Boolean(await this.getUserByEmail(email));
    if (hasUser) {
      return [{errorCode: 400, errorMessage: "User already exist" }, null];
    }
    const passwordHash = await hashPassword(password);
    const newUser = userRepository.create({ email, password: passwordHash });
    await userRepository.save(newUser);
    return [null, newUser]
  }
  public static async getUserByEmail(email: string): Promise<[{ errorCode: number, errorMessage: string } | null, UserModel | null]> {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return [{ errorCode: 400, errorMessage: "User not found" }, null];
    }
    return [null, user];
  }
}
