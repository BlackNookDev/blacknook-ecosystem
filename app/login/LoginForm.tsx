'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { Loader2, LogIn } from 'lucide-react';
import { normalizeEmail, safeCallbackUrl } from '@/lib/authUrl';
import {
  DEV_AUTO_LOGIN_PASSWORD,
  getDevAutoLoginEmail,
  isDevAutoLoginUiEnabled,
  isGoogleOAuthBypassUiEnabled,
} from '@/lib/authMode';
import { isGoogleOAuthUiEnabled } from '@/lib/googleOAuth';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 2.9.7 3.6 1.4l2.4-2.4C16.7 3.7 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c5.1 0 8.5-3.6 8.5-8.6 0-.6 0-1-.1-1.5H12z"
      />
    </svg>
  );
}

const fieldClass =
  'h-12 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get('callbackUrl'), '/account');
  const devAutoLogin = isDevAutoLoginUiEnabled();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const finishLogin = async () => {
    await getSession();
    router.push(callbackUrl || '/account');
    router.refresh();
  };

  const handleQuickLogin = async () => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: getDevAutoLoginEmail(),
        password: DEV_AUTO_LOGIN_PASSWORD,
        redirect: false,
      });

      if (result?.error) {
        setError('Otomatik giriş başarısız. Veritabanı bağlantısını kontrol edin.');
        return;
      }

      await finishLogin();
    } catch {
      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = () => {
    if (isLoading) return;
    // Geçici: gerçek Google OAuth kapalı — credentials ile içeri.
    if (isGoogleOAuthBypassUiEnabled()) {
      void handleQuickLogin();
      return;
    }
    setError('');
    setIsLoading(true);
    void signIn('google', { callbackUrl });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: normalizeEmail(email),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('E-posta veya şifre hatalı.');
        return;
      }

      await finishLogin();
    } catch {
      setError('Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleEnabled = isGoogleOAuthUiEnabled();

  if (devAutoLogin) {
    return (
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-[2.75rem]">
          Giriş yap
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Yerel oturum: tek tıkla giriş.
        </p>

        {error ? (
          <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          disabled={isLoading}
          onClick={() => void handleQuickLogin()}
          className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Giriş yapılıyor…
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" aria-hidden />
              Giriş yap
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-zinc-500">
          Git push öncesi doğrulama otomatik açılır. Yerel mod için:{' '}
          <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-zinc-400">npm run auth:dev</code>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-[2.75rem]">
        Giriş yap
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        Hesabınız yok mu?{' '}
        <Link
          href="/register"
          className="font-medium text-sky-400 transition-colors hover:text-sky-300"
        >
          Kayıt olun.
        </Link>
      </p>

      {googleEnabled ? (
        <>
          <div className="mt-8">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogle}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
            >
              <GoogleIcon />
              Google ile devam edin
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center" aria-hidden>
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-3 text-zinc-500">veya</span>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8" />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <input
          id="login-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-label="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className={fieldClass}
          placeholder="E-posta"
        />

        <input
          id="login-password"
          type="password"
          name="password"
          required
          autoComplete="current-password"
          aria-label="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className={fieldClass}
          placeholder="Şifre"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Giriş yapılıyor…
            </>
          ) : (
            'Giriş yap'
          )}
        </button>

        <p className="text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-sky-400"
          >
            Şifrenizi mi unuttunuz?
          </Link>
        </p>
      </form>
    </div>
  );
}
