import { NextResponse } from 'next/server';
import { SEARCH_LANDING_PAGES } from '@/lib/seo/rentData';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const rentPages = Object.keys(SEARCH_LANDING_PAGES || {});

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rentPages
  .map(
    (slug) => `  <url>
    <loc>${BASE_URL}/rent/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.92</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all',
    },
  });
}
