/**
 * Geliştirme: tek tıkla giriş (Google kapalı).
 * Geçici: Google butonu → gerçek OAuth yok, credentials ile içeri (bypass).
 * Production / canlı: bypass kapat, Google OAuth + normal kimlik bilgileri.
 *
 * Yerel: .env → ENABLE_DEV_AUTO_LOGIN=true veya ENABLE_GOOGLE_OAUTH_BYPASS=true
 * Push: pre-push hook → auth:prod
 */

function readFlag(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

export function isDevAutoLoginEnabled(): boolean {
  return (
    readFlag(process.env.ENABLE_DEV_AUTO_LOGIN) ||
    readFlag(process.env.NEXT_PUBLIC_ENABLE_DEV_AUTO_LOGIN)
  );
}

export function isDevAutoLoginUiEnabled(): boolean {
  return readFlag(process.env.NEXT_PUBLIC_ENABLE_DEV_AUTO_LOGIN);
}

/** Google butonu görünür ama gerçek OAuth yok — canlıya almadan önce kapat. */
export function isGoogleOAuthBypassEnabled(): boolean {
  return (
    readFlag(process.env.ENABLE_GOOGLE_OAUTH_BYPASS) ||
    readFlag(process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH_BYPASS)
  );
}

export function isGoogleOAuthBypassUiEnabled(): boolean {
  return readFlag(process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH_BYPASS);
}

export function isGoogleOAuthExplicitlyDisabled(): boolean {
  if (isDevAutoLoginEnabled()) return true;
  if (isGoogleOAuthBypassEnabled()) return true;
  return (
    process.env.ENABLE_GOOGLE_OAUTH === 'false' ||
    process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH === 'false'
  );
}

export function isGoogleOAuthEnabled(): boolean {
  if (isGoogleOAuthExplicitlyDisabled()) return false;
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()
  );
}

export function isGoogleOAuthUiEnabled(): boolean {
  if (isGoogleOAuthBypassUiEnabled()) return true;
  if (isDevAutoLoginUiEnabled()) return false;
  if (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH === 'false') return false;
  return process.env.NEXT_PUBLIC_ENABLE_GOOGLE_OAUTH !== 'false';
}

/** Credentials ile “Google” bypass / auto-login yolu (şifre eşleşince). */
export function isCredentialsAutoLoginEnabled(): boolean {
  return isDevAutoLoginEnabled() || isGoogleOAuthBypassEnabled();
}

export const DEV_AUTO_LOGIN_PASSWORD = 'bn-dev-auto';
export const DEV_AUTO_LOGIN_DISPLAY_NAME = 'Kullanıcı';

export function getDevAutoLoginEmail(): string {
  return (
    process.env.DEV_AUTO_LOGIN_EMAIL?.trim().toLowerCase() ||
    process.env.ADMIN_EMAIL?.trim().toLowerCase() ||
    'demo@blacknook.com'
  );
}
