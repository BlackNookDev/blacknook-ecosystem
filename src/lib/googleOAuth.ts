/**
 * Google ile giriş.
 * Geliştirme modunda (ENABLE_DEV_AUTO_LOGIN) kapalıdır.
 * Production'da GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET gerekir.
 */
export {
  isGoogleOAuthEnabled,
  isGoogleOAuthUiEnabled,
} from '@/lib/authMode';
