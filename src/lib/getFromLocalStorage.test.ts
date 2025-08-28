import { afterEach, describe, expect, it, vi } from 'vitest';
import { getFromLocalStorage } from './getFromLocalStorage';
import * as env from '$app/environment';

const fakeLocalStorage = { test: '{"test": "test"}', asString: 'test' };

const fakeLocalStorageAPI = {
  getItem: (localStorageName: keyof typeof fakeLocalStorage) =>
    fakeLocalStorage[localStorageName],
};

vi.stubGlobal('localStorage', fakeLocalStorageAPI);

describe('getFromLocalStorage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('Should get an item from localStorage', () => {
    vi.spyOn(env, 'browser', 'get').mockReturnValue(true);
    const item = getFromLocalStorage('test');
    expect(item).toStrictEqual({ test: 'test' });
  });
  it('Should return item as string if !object', () => {
    vi.spyOn(env, 'browser', 'get').mockReturnValue(true);
    const item = getFromLocalStorage('asString');
    expect(item).toBe('test');
  });
  it('Should not return item if !browser', () => {
    const item = getFromLocalStorage('test');
    expect(item).toBe(undefined);
  });
});
