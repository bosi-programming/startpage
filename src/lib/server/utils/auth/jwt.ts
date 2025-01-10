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
    return jwt.verify(token, PRIVATE_SECRET);
  } catch (e) {
    console.error(e);
  }
}

export function getUserIdFromToken(token: string) {
  const decodedToken = verifyToken(token) as JwtPayload;
  return decodedToken.id
}
