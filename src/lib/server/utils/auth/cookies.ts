import type { Cookies } from "@sveltejs/kit";

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
