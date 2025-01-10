import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { User } from "../models/User";
import { createToken } from "../utils/auth/jwt";
import { setSessionTokenCookie } from "../utils/auth/cookies";
import { verifyPassword } from "../utils/auth/password";

export async function authAction({ request, cookies }: RequestEvent, type: 'LOGIN' | 'REGISTER') {
  const data = await request.formData();
  const email = String(data.get('email'));
  const password = String(data.get('password'));
  if (!email) {
    return fail(400, { message: "Please add an email", isMissingEmail: !email, email });
  }
  if (!password) {
    return fail(400, { message: "Please type your password", isMissingPassword: !password, email });
  }

  const [error, user] = type === 'REGISTER' ? await User.createUser(email, password) : await User.getUserByEmail(email);
  if (error) {
    return fail(error.errorCode, { message: error.errorMessage });
  }
  if (user) {
    const token = createToken(user.id);
    const isPasswordCorrect = type === 'LOGIN' ? await verifyPassword(user.password, password) : true;
    if (token && isPasswordCorrect) {
      setSessionTokenCookie(cookies, token)
      redirect(303, '/')
    }
  }
  return { success: false, message: 'Unknown error, please try again' }
}
