import type { Actions } from "./$types";
import {  type ActionFailure } from "@sveltejs/kit";
import { authAction } from "@/lib/server/actions/auth";

type LoginAction = Promise<ActionFailure<{ message: string, isMissingEmail?: boolean, isMissingPassword?: boolean, email?: string }> | { success: boolean, message?: string }>

export const actions = {
  default: async (requestEvent): LoginAction => {
    return authAction(requestEvent, 'REGISTER');
  }
} satisfies Actions
