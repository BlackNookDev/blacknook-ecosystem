import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GONE = {
  error: 'Geliştirici başvuru yüzeyi kapatıldı.',
  code: 'DEVELOPER_APPLICATIONS_DEPRECATED',
};

/** @deprecated */
export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function PATCH() {
  return NextResponse.json(GONE, { status: 410 });
}
