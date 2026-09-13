import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export async function GET() {
  const sitemaps = [
    'sitemap-pages.xml',
    'sitemap-properties.xml',
    'sitemap-cities.xml',
    'sitemap-localities.xml',
    'sitemap-flatmates.xml',
    'sitemap-pg.xml',
    'sitemap-commercial.xml',
    'sitemap-showreels.xml',
    'video-sitemap.xml',
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
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
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
