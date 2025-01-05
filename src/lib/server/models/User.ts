import { hashPassword } from "../auth/password";
import { userRepository } from "../repositories";

export class User {
  public static async createUser(email: string, password: string) {
    const hasUser = Boolean(await this.getUserByEmail(email));
    if (hasUser) {
      throw new Error("User already exist");
    }
    const passwordHash = await hashPassword(password);
    const newUser = userRepository.create({ email, password: passwordHash });
    await userRepository.save(newUser);
  }
  public static async getUserByEmail(email: string) {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
