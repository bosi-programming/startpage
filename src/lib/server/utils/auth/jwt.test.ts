import { describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';

vi.mock('$env/dynamic/private', () => ({
  env: { PRIVATE_SECRET: 'runtime-secret' },
}));

const { createToken, getUserIdFromToken } = await import('./jwt');

describe('jwt', () => {
  it('Should sign tokens with the secret read at runtime', () => {
    const token = createToken(7)!;
    const payload = jwt.verify(token, 'runtime-secret') as jwt.JwtPayload;
    expect(payload.id).toBe(7);
  });

  it('Should read the user id from a token it created', () => {
    const token = createToken(42)!;
    expect(getUserIdFromToken(token)).toStrictEqual([null, 42]);
  });
});
