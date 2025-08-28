import type { PageServerLoad } from './$types';
import { loadUserConfig } from '@/lib/server/actions/loadUserConfig';
import type { Config } from '@/lib/server/entities/Config';
import { error } from '@sveltejs/kit';

type LoadAction = Promise<Config>;

export const load: PageServerLoad = async ({ cookies }): LoadAction => {
  const [userError, userConfig] = await loadUserConfig(cookies);
  if (userError) {
    return error(userError.errorCode, { message: userError.errorMessage });
  }
  return { ...userConfig } as Config;
};
