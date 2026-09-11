/** Pitch deck erişim kapısı — PITCH_DECK_PASSWORD ile korunur. */

export const PITCH_ACCESS_COOKIE = 'bn_pitch_access';

export function getPitchDeckPassword(): string {
  return process.env.PITCH_DECK_PASSWORD?.trim() || '';
}

export function isPitchPasswordConfigured(): boolean {
  return getPitchDeckPassword().length > 0;
}

export function verifyPitchPassword(input: string): boolean {
  const expected = getPitchDeckPassword();
  if (!expected) return false;
  return input.trim() === expected;
}

export function isPitchUnlockPath(pathname: string): boolean {
  return pathname === '/pitch/unlock' || pathname.startsWith('/pitch/unlock/');
}

export function isPitchProtectedPath(pathname: string): boolean {
  if (!pathname.startsWith('/pitch')) return false;
  if (isPitchUnlockPath(pathname)) return false;
  return true;
}
