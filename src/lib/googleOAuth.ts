/**
 * Google ile giriş.
 * Yerel geliştirmede kapalı tutun; GitHub / prod öncesi `true` yapın
 * (ayrıca GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET ve isteğe bağlı NEXT_PUBLIC_GOOGLE_OAUTH=1).
 */
export const ENABLE_GOOGLE_OAUTH = true;

export function isGoogleOAuthEnabled(): boolean {
  if (!ENABLE_GOOGLE_OAUTH) return false;
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()
  );
}

/** Client UI — build-time sabit; sunucu kimlik bilgisi istemez */
export function isGoogleOAuthUiEnabled(): boolean {
  return ENABLE_GOOGLE_OAUTH;
}
