import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserRole } from '@farahna/shared';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
