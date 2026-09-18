import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://rehvo.in';

export async function GET() {
  let properties: any[] = [];
  try {
    const res = await getPublishedProperties({ category: 'commercial', limit: 50 });
    properties = Array.isArray(res?.properties) ? res.properties : [];
  } catch (err) {
    properties = [];
  }

  const now = new Date().toISOString().split('T')[0];

  const commercialPropertyUrls = properties.map((p) => {
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
    <loc>${BASE_URL}/commercial</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
${commercialPropertyUrls.join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
