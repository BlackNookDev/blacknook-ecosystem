import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GONE = {
  error:
    'Eşleştirme kapatıldı. Kurulum ve destek için “Kurulum Talep Et” veya /api/installation-request kullanın.',
  code: 'MATCH_DEPRECATED',
};

/** @deprecated Managed onboarding — installation_requests */
export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function POST() {
  return NextResponse.json(GONE, { status: 410 });
}
