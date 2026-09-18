import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const indexNowKey =
    process.env.INDEXNOW_KEY ||
    'e58f2d5930b847849e71e7d890538a7c';

  return new NextResponse(indexNowKey, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
