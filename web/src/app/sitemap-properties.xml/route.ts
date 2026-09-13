import { NextResponse } from 'next/server';
import { getAllPublishedPropertySlugs } from '@/lib/seo/queries';
import { generatePropertySlug, slugify } from '@/lib/seo/slugs';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export async function GET() {
  const publishedProperties = await getAllPublishedPropertySlugs();
  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publishedProperties
  .flatMap((p) => {
    const slug = generatePropertySlug({ id: p.id, title: p.title, locality: p.locality, city: p.city });
    const citySlug = slugify(p.city || 'mumbai');
    const localitySlug = slugify(p.locality || 'andheri-west');
    const lastMod = p.updated_at ? p.updated_at.split('T')[0] : now;

    return [
      `  <url>
    <loc>${BASE_URL}/property/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`,
      `  <url>
    <loc>${BASE_URL}/${citySlug}/${localitySlug}/${slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`,
    ];
  })
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
    },
  });
}
