import { env } from '$env/dynamic/private';

export function databasePath() {
  return env.PRIVATE_DATABASE_PATH ?? 'database';
}
