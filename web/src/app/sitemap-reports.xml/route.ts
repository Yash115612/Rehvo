import { MARKET_REPORTS } from '@/lib/seo/marketReportsData';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://rehvo.in';

export async function GET() {
  const now = new Date().toISOString().split('T')[0];
  const reportSlugs = Object.keys(MARKET_REPORTS || {});

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/reports</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
${reportSlugs
  .map((slug) => {
    const report = MARKET_REPORTS[slug];
    const lastmod = report.publishDate || now;
    return `  <url>
    <loc>${BASE_URL}/reports/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.82</priority>
  </url>`;
  })
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
