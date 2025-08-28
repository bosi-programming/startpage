import type { Cookies } from '@sveltejs/kit';
import { getUserIdFromCookies } from '../utils/auth/cookies';
import { userModel } from '../models/User';
import type { Config } from '../entities/Config';

export async function loadUserConfig(
  cookies: Cookies,
): Promise<
  [{ errorCode: number; errorMessage: string } | null, Config | null]
> {
  const userId = getUserIdFromCookies(cookies);
  const [userError, user] = await userModel.getById(userId);
  if (userError) {
    return [userError, null];
  }

  return [null, user?.config || null];
}
