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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isDeprecatedPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isPitchProtectedPath(pathname)) {
    const hasAccess = request.cookies.get(PITCH_ACCESS_COOKIE)?.value === '1';
    if (!hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/pitch/unlock';
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  // Zaten cookie varsa unlock’a gerek yok
  if (isPitchUnlockPath(pathname)) {
    const hasAccess = request.cookies.get(PITCH_ACCESS_COOKIE)?.value === '1';
    if (hasAccess) {
      const next = request.nextUrl.searchParams.get('next');
      const url = request.nextUrl.clone();
      url.pathname =
        next && next.startsWith('/pitch') && !next.startsWith('//')
          ? next
          : '/pitch';
      url.search = '';
      return NextResponse.redirect(url);
    }
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
  if (allowedOrigin && pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/sell',
    '/sell/:path*',
    '/select',
    '/select/:path*',
    '/vendor',
    '/vendor/:path*',
    '/developers',
    '/developers/:path*',
    '/partners',
    '/partners/:path*',
    '/admin/developers',
    '/admin/developers/:path*',
    '/admin/products',
    '/admin/products/:path*',
    '/pitch',
    '/pitch/:path*',
  ],
};
