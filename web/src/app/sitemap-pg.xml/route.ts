import { NextResponse } from 'next/server';
import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { LOCALITIES_DATA } from '@/lib/seo/localityData';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export async function GET() {
  const { properties } = await getPublishedProperties({ type: 'pg', limit: 50 });
  const now = new Date().toISOString().split('T')[0];

  const pgPropertyUrls = properties.map((p) => {
    const slug = generatePropertySlug({ id: p.id, title: p.title, locality: p.locality, city: p.city });
    return `  <url>
    <loc>${BASE_URL}/property/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/pg</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${pgPropertyUrls.join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
