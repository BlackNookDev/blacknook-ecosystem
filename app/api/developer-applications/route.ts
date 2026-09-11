import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GONE = {
  error: 'Geliştirici başvuru yüzeyi kapatıldı. Kurulum için “Kurulum Talep Et” kullanın.',
  code: 'DEVELOPER_APPLICATIONS_DEPRECATED',
};

/** @deprecated Hibrit developer/partner yüzeyi kaldırıldı */
export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function POST() {
  return NextResponse.json(GONE, { status: 410 });
}
