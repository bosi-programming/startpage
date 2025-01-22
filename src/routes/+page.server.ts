import type { PageServerLoad } from './$types';
import { loadUserConfig } from '@/lib/server/actions/loadUserConfig';
import type { Config } from '@/lib/server/entities/Config';

type LoadAction = Promise<Config>

export const load: PageServerLoad = async ({ cookies }): LoadAction => {
  const [error, userConfig] = await loadUserConfig(cookies)
  if (error) {
    return null as unknown as Config
  }
  return userConfig as Config;
};
