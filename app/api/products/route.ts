import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GONE = {
  error: 'Ürün listeleme API’si kapatıldı. Keşif ve kurulum için katalog + Kurulum Talep Et kullanın.',
  code: 'PRODUCTS_DEPRECATED',
};

/** @deprecated Hibrit marketplace ürün API’si */
export async function GET() {
  return NextResponse.json(GONE, { status: 410 });
}

export async function POST() {
  return NextResponse.json(GONE, { status: 410 });
}
