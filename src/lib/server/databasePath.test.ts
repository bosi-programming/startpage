import { afterEach, describe, expect, it, vi } from 'vitest';

const runtimeEnv: Record<string, string | undefined> = {};

vi.mock('$env/dynamic/private', () => ({ env: runtimeEnv }));

const { databasePath } = await import('./databasePath');

describe('databasePath', () => {
  afterEach(() => {
    delete runtimeEnv.PRIVATE_DATABASE_PATH;
  });

  it('Should use PRIVATE_DATABASE_PATH when it is set', () => {
    runtimeEnv.PRIVATE_DATABASE_PATH = '/data/database';
    expect(databasePath()).toBe('/data/database');
  });

  it('Should fall back to a file in the working directory', () => {
    expect(databasePath()).toBe('database');
  });
});
