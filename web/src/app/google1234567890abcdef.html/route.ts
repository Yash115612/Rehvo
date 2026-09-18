import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const verificationCode =
    process.env.GOOGLE_SITE_VERIFICATION ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    'google1234567890abcdef';

  return new NextResponse(`google-site-verification: ${verificationCode}.html`, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
