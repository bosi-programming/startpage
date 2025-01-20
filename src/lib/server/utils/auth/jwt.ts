import jwt, { type JwtPayload } from 'jsonwebtoken'
import { PRIVATE_SECRET } from '$env/static/private';

export function createToken(userId: number) {
  try {
    return jwt.sign({ id: userId }, PRIVATE_SECRET, { expiresIn: '365 days' });
  } catch (e) {
    console.error(e);
  }
}

export function verifyToken(token: string) {
  try {
    return [null, jwt.verify(token, PRIVATE_SECRET) as JwtPayload];
  } catch (error) {
    return [{ errorCode: 500, error }, null]
  }
}

export function getUserIdFromToken(token: string) {
  const [error, decodedToken] = verifyToken(token);
  if (error) {
    return [error, null]
  }
  return [null, decodedToken!.id]
}
