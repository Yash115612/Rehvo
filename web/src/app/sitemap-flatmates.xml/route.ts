import { NextResponse } from 'next/server';
import { getPublishedFlatmates } from '@/lib/seo/queries';
import { CITIES_DATA } from '@/lib/seo/localityData';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export async function GET() {
  const flatmates = await getPublishedFlatmates('all');
  const now = new Date().toISOString().split('T')[0];
  const cities = Object.keys(CITIES_DATA);

  const cityUrls = cities.map(
    (c) => `  <url>
    <loc>${BASE_URL}/flatmates/${c}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>`
  );

  const profileUrls = flatmates.map(
    (f) => `  <url>
    <loc>${BASE_URL}/flatmates/${f.id}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/flatmates</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${cityUrls.join('\n')}
${profileUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
