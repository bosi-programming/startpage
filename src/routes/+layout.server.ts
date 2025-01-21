import { getUserIdFromCookies } from '@/lib/server/utils/auth/cookies';
import type { LayoutServerLoad } from './$types';
import { userModel } from '@/lib/server/models/User';
import { fail } from '@sveltejs/kit';

const NON_LOGGED_ROUTES = ['/login', '/register'];

export const load: LayoutServerLoad = async ({ cookies, route }) => {
  if (NON_LOGGED_ROUTES.includes(route.id as string)) {
    return
  }
  const userId = getUserIdFromCookies(cookies);
  const [error, user] = await userModel.getById(userId, userId);

  if (error) {
    return fail(error.errorCode, { message: error.errorMessage });
  }
  console.log(user)
};
