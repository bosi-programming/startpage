import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { loadUserConfig } from '@/lib/server/actions/loadUserConfig';

export const load: PageServerLoad = async ({ cookies }) => {
  const [error, userConfig] = await loadUserConfig(cookies)
  if (error) {
    fail(error.errorCode, { message: error.errorMessage})
  }
  return userConfig;
};
