import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export async function GET() {
  const childSitemaps = [
    'sitemap-pages.xml',
    'sitemap-properties.xml',
    'sitemap-localities.xml',
    'sitemap-rent-pages.xml',
    'sitemap-blogs.xml',
    'sitemap-stories.xml',
    'sitemap-reports.xml',
    'sitemap-cities.xml',
    'sitemap-flatmates.xml',
    'sitemap-pg.xml',
    'sitemap-commercial.xml',
    'sitemap-showreels.xml',
    'video-sitemap.xml',
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${childSitemaps
  .map(
    (sm) => `  <sitemap>
    <loc>${BASE_URL}/${sm}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all',
    },
  });
}
