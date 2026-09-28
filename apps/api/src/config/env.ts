import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isProd = process.env.NODE_ENV === 'production';

// In production, ensure mandatory secrets are provided and not default
if (isProd) {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('default') || process.env.JWT_SECRET.length < 32) {
    console.error('CRITICAL SECURITY ERROR: In production, JWT_SECRET must be a secure, random string at least 32 characters long.');
  }
  if (!process.env.DATABASE_URL) {
    console.error('CRITICAL CONFIG ERROR: In production, DATABASE_URL must be provided.');
  }
}

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'farahna_secret_dev_jwt_key_not_for_prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  STORAGE_PATH: process.env.STORAGE_PATH || path.resolve(process.cwd(), 'storage'),
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE, 10) : 10 * 1024 * 1024,
  DEFAULT_TIMEZONE: process.env.DEFAULT_TIMEZONE || 'Africa/Cairo',
};
