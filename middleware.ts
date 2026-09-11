import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  PITCH_ACCESS_COOKIE,
  isPitchProtectedPath,
  isPitchUnlockPath,
} from '@/lib/pitchGate';

function getAllowedOrigin(): string | null {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, '') ||
    null
  );
}

/** Public marketplace / match / developer yüzeyleri — hibrit deprecate */
const DEPRECATED_PREFIXES = [
  '/sell',
  '/select',
  '/vendor',
  '/developers',
  '/partners',
  '/admin/developers',
  '/admin/products',
] as const;

function isDeprecatedPath(pathname: string): boolean {
  return DEPRECATED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function clearPitchAccessCookie(response: NextResponse) {
  response.cookies.set({
    name: PITCH_ACCESS_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

function isPitchFamilyPath(pathname: string): boolean {
  return pathname === '/pitch' || pathname.startsWith('/pitch/');
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isDeprecatedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    const response = NextResponse.redirect(url);
    if (request.cookies.get(PITCH_ACCESS_COOKIE)?.value === '1') {
      clearPitchAccessCookie(response);
    }
    return response;
  }

  if (isPitchProtectedPath(pathname)) {
    const hasAccess = request.cookies.get(PITCH_ACCESS_COOKIE)?.value === '1';
    if (!hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/pitch/unlock';
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Unlock her zaman şifre ister (eski oturumu düşür).
  if (isPitchUnlockPath(pathname)) {
    const response = NextResponse.next();
    if (request.cookies.get(PITCH_ACCESS_COOKIE)?.value === '1') {
      clearPitchAccessCookie(response);
    }
    return response;
  }

  const allowedOrigin = getAllowedOrigin();

  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    const response = new NextResponse(null, { status: 204 });
    if (allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Max-Age', '86400');
    }
    return response;
  }

  const response = NextResponse.next();

  // Pitch dışına (sayfa navigasyonu) çıkınca erişimi sil.
  // /api/* isteklerinde silme — unlock sonrası session poll cookie’yi düşürmesin.
  if (
    !pathname.startsWith('/api/') &&
    !isPitchFamilyPath(pathname) &&
    request.cookies.get(PITCH_ACCESS_COOKIE)?.value === '1'
  ) {
    clearPitchAccessCookie(response);
  }

  if (allowedOrigin && pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Pitch erişim çerezini site genelinde yönetmek için statik asset’ler hariç tüm path’ler.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
