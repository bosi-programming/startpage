import { User } from "../models/User";
import { verifyPassword } from "./password";

export async function login(email: string, password: string) {
  const user = await User.getUserByEmail(email);
  const hashedPassword = user.password;
  const isPasswordCorrect = verifyPassword(hashedPassword, password);
}
