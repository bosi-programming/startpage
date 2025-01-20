import { redirect, type Cookies} from "@sveltejs/kit";
import { getUserIdFromToken } from "./jwt";

export function setSessionTokenCookie(cookies: Cookies, token: string): void {
  cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}

export function getSessionTokenCookie(cookies: Cookies) {
  return cookies.get('session')
}

export function deleteSessionTokenCookie(cookies: Cookies): void {
  cookies.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/"
  });
}

export function getUserIdFromCookies(cookies: Cookies) {
  const token = getSessionTokenCookie(cookies) || '';
  const [error, userId] = getUserIdFromToken(token)

  if (error || !userId) {
    redirect(303, '/login')
  }
  return userId
}
