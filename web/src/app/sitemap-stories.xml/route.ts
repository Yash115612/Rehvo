import { REHVO_STORIES } from '@/lib/seo/storiesData';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://rehvo.in';

export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const storySlugs = Object.keys(REHVO_STORIES || {});

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/stories</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
${storySlugs
  .map(
    (slug) => `  <url>
    <loc>${BASE_URL}/stories/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.83</priority>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
