import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const bingAuthCode =
    process.env.BING_SITE_AUTH ||
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
    'BING1234567890ABCDEF';

  const xml = `<?xml version="1.0"?>
<users>
  <user>${bingAuthCode}</user>
</users>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
