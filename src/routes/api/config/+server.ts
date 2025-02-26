import { saveUserConfig } from '@/lib/server/actions/saveUserConfig';
import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { getUserIdFromCookies } from '@/lib/server/utils/auth/cookies';
import { userModel } from '@/lib/server/models/User';

export const POST: RequestHandler = async (requestEvent) => {
  const userId = getUserIdFromCookies(requestEvent.cookies);
  const [, user] = await userModel.getById(userId);
  const newConfig = await requestEvent.request.json()
  const [configError, config] = await saveUserConfig(requestEvent.cookies, newConfig, user?.config?.id);
  if (configError) {
    return error(configError.errorCode, { message: configError.errorMessage })
  }
  try {
    return new Response(JSON.stringify(config))
  } catch (e) {
    return error(500, { message: (e as Error).message })
  }
};
