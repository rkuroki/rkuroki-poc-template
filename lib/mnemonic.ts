import crypto from 'crypto';

export function generateMnemonic(): string {
  return crypto.randomUUID().replace(/-/g, '').substring(0, 8);
}
