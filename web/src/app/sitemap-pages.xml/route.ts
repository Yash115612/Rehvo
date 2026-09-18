import { BLOG_POSTS } from '@/lib/seo/blogData';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://rehvo.in';

export async function GET() {
  const now = new Date().toISOString().split('T')[0];

  const pages: { url: string; priority: string; changefreq: string; lastmod?: string }[] = [
    { url: `${BASE_URL}`, priority: '1.0', changefreq: 'daily', lastmod: now },
    { url: `${BASE_URL}/rent`, priority: '0.95', changefreq: 'daily', lastmod: now },
    { url: `${BASE_URL}/search`, priority: '0.95', changefreq: 'daily', lastmod: now },
    { url: `${BASE_URL}/flatmates`, priority: '0.9', changefreq: 'daily', lastmod: now },
    { url: `${BASE_URL}/pg`, priority: '0.9', changefreq: 'daily', lastmod: now },
    { url: `${BASE_URL}/commercial`, priority: '0.9', changefreq: 'daily', lastmod: now },
    { url: `${BASE_URL}/society-services`, priority: '0.85', changefreq: 'weekly', lastmod: now },
    { url: `${BASE_URL}/guides`, priority: '0.90', changefreq: 'weekly', lastmod: now },
    { url: `${BASE_URL}/authors/rehvo-editorial`, priority: '0.85', changefreq: 'weekly', lastmod: now },
    { url: `${BASE_URL}/showreels`, priority: '0.85', changefreq: 'weekly', lastmod: now },
    { url: `${BASE_URL}/ai-concierge`, priority: '0.80', changefreq: 'weekly', lastmod: now },
    { url: `${BASE_URL}/safety`, priority: '0.70', changefreq: 'monthly', lastmod: now },
    { url: `${BASE_URL}/download`, priority: '0.80', changefreq: 'monthly', lastmod: now },
    { url: `${BASE_URL}/about`, priority: '0.60', changefreq: 'monthly', lastmod: now },
    { url: `${BASE_URL}/contact`, priority: '0.60', changefreq: 'monthly', lastmod: now },
    { url: `${BASE_URL}/privacy`, priority: '0.60', changefreq: 'monthly', lastmod: now },
    { url: `${BASE_URL}/terms`, priority: '0.60', changefreq: 'monthly', lastmod: now },
    { url: `${BASE_URL}/careers`, priority: '0.60', changefreq: 'monthly', lastmod: now },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod || now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
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
