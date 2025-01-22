import { getUserIdFromCookies } from '@/lib/server/utils/auth/cookies';
import type { LayoutServerLoad } from './$types';
import { userModel } from '@/lib/server/models/User';
import { fail, type ActionFailure } from '@sveltejs/kit';
import type { Config } from '@/lib/server/entities/Config';

const NON_LOGGED_ROUTES = ['/login', '/register'];

type LoadAction = Promise<ActionFailure<{ message: string }> | Config | null>

export const load: LayoutServerLoad = async ({ cookies, route }): LoadAction => {
  if (NON_LOGGED_ROUTES.includes(route.id as string)) {
    return null
  }
  const userId = getUserIdFromCookies(cookies);
  const [error, user] = await userModel.getById(userId, userId);

  if (error) {
    return fail(error.errorCode, { message: error.errorMessage });
  }
  return user?.config || null
};
