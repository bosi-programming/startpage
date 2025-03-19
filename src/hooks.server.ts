import "reflect-metadata"
import { TypeOrm } from "$lib/server/database";

await TypeOrm.getDb();

const securityHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

import { redirect, type Handle } from '@sveltejs/kit';
import { getUserIdFromCookies } from "./lib/server/utils/auth/cookies";
import { userModel } from "./lib/server/models/User";
const NON_LOGGED_ROUTES = ['/login', '/register'];

export const handle: Handle = async ({ event, resolve }) => {
  if (NON_LOGGED_ROUTES.includes(event.route.id as string)) {
    return await resolve(event)
  }
  const userId = getUserIdFromCookies(event.cookies);
  const [userError] = await userModel.getById(userId);

  if (userError) {
    event.cookies.delete("session", { path: "/" })
    redirect(400, '/login')
  }

  const response = await resolve(event);
  Object.entries(securityHeaders).forEach(
    ([header, value]) => response.headers.set(header, value)
  );
  return response;
}
