import { createHash } from 'crypto';

export const DRIVER_AUTH_COOKIE = 'driver_auth';

export function driverAuthToken(password: string): string {
  return createHash('sha256').update(`driver:${password}`).digest('hex');
}
