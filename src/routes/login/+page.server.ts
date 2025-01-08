import { User } from "@/lib/server/models/User";
import type { Actions } from "./$types";
import { fail, type ActionFailure } from "@sveltejs/kit";
import { verifyPassword } from "@/lib/server/auth/password";
import { createToken } from "@/lib/server/auth/jwt";

export type LoginAction = Promise<ActionFailure<{ message: string, isMissingEmail?: boolean, isMissingPassword?: boolean, email?: string }> | { success: boolean, token?: string }>

export const actions = {
  default: async ({ request }): LoginAction => {
    const data = await request.formData();
    const email = String(data.get('email'));
    const password = String(data.get('password'));
    if (!email) {
      return fail(400, { message: "Please add an email", isMissingEmail: !email, email });
    }
    if (!password) {
      return fail(400, { message: "Please type your password", isMissingPassword: !password, email });
    }

    const [error, user] = await User.getUserByEmail(email);
    if (error) {
      return fail(error.errorCode, { message: error.errorMessage });
    }

    if (user) {
      const isPasswordCorrect = await verifyPassword(user.password, password)
      if (isPasswordCorrect) {
        const token = createToken(user.id);
        return { success: true, token }
      }
    }
    return { success: false }
  }
} satisfies Actions
