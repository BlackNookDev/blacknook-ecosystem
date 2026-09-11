import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GONE = {
  error: 'Liste taslağı API’si kapatıldı.',
  code: 'LISTING_DRAFT_DEPRECATED',
};

/** @deprecated */
export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function POST() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json(GONE, { status: 410 });
}
