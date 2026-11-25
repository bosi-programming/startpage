import { describe, expect, it, vi } from 'vitest';
import type { RequestEvent } from '@sveltejs/kit';

vi.mock('$env/dynamic/private', () => ({
  env: { PRIVATE_SECRET: 'route-secret' },
}));

vi.mock('@/lib/server/actions/auth', () => ({
  authAction: vi.fn(async () => ({
    success: false,
    message: 'Invalid email or password',
  })),
}));

const { actions } = await import('./+page.server');

function client(ip: string) {
  const event = () =>
    ({
      request: new Request('http://localhost/login', {
        method: 'POST',
        headers: { 'user-agent': 'vitest' },
      }),
      url: new URL('http://localhost/login'),
      getClientAddress: () => ip,
      route: { id: '/login' },
      params: {},
      locals: {},
      platform: undefined,
      setHeaders: () => { },
      fetch,
      isDataRequest: false,
      isSubRequest: false,
    }) as unknown as RequestEvent;

  return {
    login: () =>
      (actions.default as (e: RequestEvent) => Promise<unknown>)(event()),
  };
}

async function attempt(browser: ReturnType<typeof client>) {
  try {
    await browser.login();
    return 200;
  } catch (thrown) {
    return (thrown as { status?: number }).status;
  }
}

describe('login rate limit', () => {
  it('Should let one IP try 5 logins in a row', async () => {
    const browser = client('192.0.2.1');

    const statuses = [];
    for (let i = 0; i < 5; i++) statuses.push(await attempt(browser));

    expect(statuses).toStrictEqual([200, 200, 200, 200, 200]);
  });

  it('Should answer 429 to the 6th login from the same IP', async () => {
    const browser = client('192.0.2.2');

    for (let i = 0; i < 5; i++) await attempt(browser);

    expect(await attempt(browser)).toBe(429);
  });

  it('Should not limit another IP when one IP is blocked', async () => {
    const attacker = client('192.0.2.4');
    for (let i = 0; i < 6; i++) await attempt(attacker);

    expect(await attempt(client('192.0.2.5'))).toBe(200);
  });

  it('Should not expose a debug action on the login page', () => {
    expect(Object.keys(actions)).toStrictEqual(['default']);
  });
});
