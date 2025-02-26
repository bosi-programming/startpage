import type { Cookies } from "@sveltejs/kit";
import { getUserIdFromCookies } from "../utils/auth/cookies";
import { userModel } from "../models/User";
import type { Config } from "../entities/Config";
import { configModel } from "../models/Config";

export async function saveUserConfig(cookies: Cookies, configFromFE: Omit<Config, 'user' | 'id'>, configId?: number): Promise<[{ errorCode: number, errorMessage: string } | null, Config | null]> {
  const userId = getUserIdFromCookies(cookies);
  const [userError, user] = await userModel.getById(userId);
  if (userError) {
    return [userError, null]
  }

  if (configId) {
    const [configError, updatedConfig] = await configModel.put({ ...configFromFE, id: configId, user })
    if (configError) {
      return [configError, null]
    }
    return [null, updatedConfig || null]
  }

  const [configError, newConfig] = await configModel.create({ ...configFromFE, user })
  if (configError) {
    return [configError, null]
  }
  return [null, newConfig || null]
}

