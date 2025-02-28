import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { userModel } from "../models/User";
import { createToken, } from "../utils/auth/jwt";
import {  setSessionTokenCookie } from "../utils/auth/cookies";
import { verifyPassword } from "../utils/auth/password";
import { loginSchema } from "$lib/schemas/auth";

export async function authAction({ request, cookies }: RequestEvent, type: 'LOGIN' | 'REGISTER') {
  const data = await request.formData();
  const email = String(data.get('email'));
  const password = String(data.get('password'));
  
  // Validate with Zod
  const validationResult = loginSchema.safeParse({ email, password });
  
  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    return fail(400, { 
      message: errors.email?.[0] || errors.password?.[0] || "Invalid form data",
      isMissingEmail: !!errors.email,
      isMissingPassword: !!errors.password,
      email 
    });
  }

  const [error, user] = type === 'REGISTER' ? await userModel.createUser(email, password) : await userModel.getUserByEmail(email);
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

