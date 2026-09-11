import { NextResponse } from 'next/server';
import {
  PITCH_ACCESS_COOKIE,
  isPitchPasswordConfigured,
  verifyPitchPassword,
} from '@/lib/pitchGate';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isPitchPasswordConfigured()) {
    return NextResponse.json(
      { error: 'Pitch şifresi yapılandırılmamış (PITCH_DECK_PASSWORD).' },
      { status: 503 }
    );
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: string };
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  if (!verifyPitchPassword(password)) {
    return NextResponse.json({ error: 'Şifre hatalı.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const secure =
    process.env.NEXTAUTH_URL?.startsWith('https://') === true ||
    Boolean(process.env.VERCEL);

  response.cookies.set({
    name: PITCH_ACCESS_COOKIE,
    value: '1',
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
