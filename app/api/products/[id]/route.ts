import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GONE = {
  error: 'Ürün listeleme API’si kapatıldı.',
  code: 'PRODUCTS_DEPRECATED',
};

/** @deprecated */
export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function PATCH() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json(GONE, { status: 410 });
}
