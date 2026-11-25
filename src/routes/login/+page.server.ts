import type { Actions } from './$types';
import { type ActionFailure, error } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { authAction } from '@/lib/server/actions/auth';

const limiter = new RateLimiter({
  IP: [10, 'h'],
  IPUA: [5, 'm'],
});

type LoginAction = Promise<
  | ActionFailure<{
      message: string;
      isMissingEmail?: boolean;
      isMissingPassword?: boolean;
      email?: string;
    }>
  | { success: boolean; message?: string }
>;

export const actions = {
  default: async (requestEvent): LoginAction => {
    if (await limiter.isLimited(requestEvent)) {
      error(429, 'Too many login attempts, please try again later');
    }
    return authAction(requestEvent, 'LOGIN');
  },
} satisfies Actions;
