import { NextResponse } from 'next/server';
import { getAllPublishedPropertySlugs } from '@/lib/seo/queries';
import { generatePropertySlug, slugify } from '@/lib/seo/slugs';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

const FALLBACK_PROPERTIES = [
  {
    id: 'prop-sea-facing-bandra',
    title: 'Sea-Facing 2 BHK in Bandra West',
    locality: 'Bandra West',
    city: 'Mumbai',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prop-luxury-powai-lake',
    title: 'Luxury 3 BHK Lake-View Apartment in Powai',
    locality: 'Powai',
    city: 'Mumbai',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'prop-compact-studio-andheri',
    title: 'Furnished Studio Near DN Nagar Metro, Andheri West',
    locality: 'Andheri West',
    city: 'Mumbai',
    updated_at: '2026-03-01T00:00:00.000Z',
  },
];

export async function GET() {
  let publishedProperties: any[] = [];
  try {
    const data = await getAllPublishedPropertySlugs();
    if (Array.isArray(data) && data.length > 0) {
      publishedProperties = data;
    } else {
      publishedProperties = FALLBACK_PROPERTIES;
    }
  } catch (err) {
    publishedProperties = FALLBACK_PROPERTIES;
  }

  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publishedProperties
  .map((p) => {
    const slug = generatePropertySlug({ id: p.id, title: p.title, locality: p.locality, city: p.city });
    const lastMod = p.updated_at ? p.updated_at.split('T')[0] : now;

    return `  <url>
    <loc>${BASE_URL}/property/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>`;
  })
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
