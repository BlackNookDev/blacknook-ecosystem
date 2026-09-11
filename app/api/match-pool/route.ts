import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** @deprecated Public match pool kaldırıldı */
export async function GET() {
  return NextResponse.json(
    {
      count: 0,
      people: [],
      deprecated: true,
      message: 'Eşleştirme havuzu kapatıldı.',
    },
    { status: 410 }
  );
}
