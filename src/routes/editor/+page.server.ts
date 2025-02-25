import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import { loadUserConfig } from '@/lib/server/actions/loadUserConfig';
import { saveUserConfig } from '@/lib/server/actions/saveUserConfig';
import type { Config } from '@/lib/server/entities/Config';
import { error } from '@sveltejs/kit';

type LoadAction = Promise<Config>

export const load: PageServerLoad = async ({ cookies }): LoadAction => {
  const [userError, userConfig] = await loadUserConfig(cookies)
  if (userError) {
    return error(userError.errorCode, { message: userError.errorMessage })
  }
  return userConfig as Config;
};

type SaveConfigAction = Promise<Config>

export const actions = {
  default: async (requestEvent): SaveConfigAction => {
    const newConfig = await requestEvent.request.formData() as unknown as Config;
    const id = newConfig.id;
    const [configError, config] = await saveUserConfig(requestEvent.cookies, newConfig, id);
    if (configError) {
      return error(configError.errorCode, { message: configError.errorMessage })
    }
    return config as Config
  }
} satisfies Actions
