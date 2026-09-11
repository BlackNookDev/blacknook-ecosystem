/**
 * Google ile giriş.
 * ENABLE_GOOGLE_OAUTH_BYPASS: buton görünür, gerçek OAuth yok.
 * ENABLE_DEV_AUTO_LOGIN: tek tık giriş (Google UI kapalı).
 * Canlı: bypass false + GOOGLE_CLIENT_ID/SECRET.
 */
export {
  isGoogleOAuthEnabled,
  isGoogleOAuthUiEnabled,
  isGoogleOAuthBypassUiEnabled,
} from '@/lib/authMode';
