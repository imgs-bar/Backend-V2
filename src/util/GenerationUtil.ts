import * as crypto from 'crypto';

export function generateRandomString(length: number) {
  return crypto.randomBytes(length).toString('hex');
}
