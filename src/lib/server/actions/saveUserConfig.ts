import type { Cookies } from "@sveltejs/kit";
import { getUserIdFromCookies } from "../utils/auth/cookies";
import { userModel } from "../models/User";
import type { Config } from "../entities/Config";
import { configModel } from "../models/Config";

export async function saveUserConfig(cookies: Cookies, configFromFE: Omit<Config, 'user' | 'id' | 'updatedAt'>, configId?: number): Promise<[{ errorCode: number, errorMessage: string } | null, Config | null]> {
  const userId = getUserIdFromCookies(cookies);
  const [userError, user] = await userModel.getById(userId);
  if (userError) {
    return [userError, null]
  }

  if (configId) {
    const [configGetError, currentConfig] = await configModel.getById(configId);
    if (configGetError) {
      return [configGetError, null]
    }
    if (currentConfig.userId !== user.id) {
      return [{ errorCode: 400, errorMessage: 'User does not own config' }, null]
    }
    const [configError, updatedConfig] = await configModel.put({ ...configFromFE, updatedAt: new Date().getTime(), id: configId, user, userId: user.id })
    if (configError) {
      return [configError, null]
    }
    return [null, updatedConfig || null]
  }

  const [configError, newConfig] = await configModel.create({ ...configFromFE, updatedAt: new Date().getTime(), userId: user.id, user })
  if (configError) {
    return [configError, null]
  }
  return [null, newConfig || null]
}

