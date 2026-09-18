export const dynamic = 'force-dynamic';

export async function GET() {
  const childSitemaps = [
    'https://rehvo.in/sitemap-pages.xml',
    'https://rehvo.in/sitemap-properties.xml',
    'https://rehvo.in/sitemap-localities.xml',
    'https://rehvo.in/sitemap-rent-pages.xml',
    'https://rehvo.in/sitemap-blogs.xml',
    'https://rehvo.in/sitemap-stories.xml',
    'https://rehvo.in/sitemap-reports.xml',
    'https://rehvo.in/sitemap-cities.xml',
    'https://rehvo.in/sitemap-flatmates.xml',
    'https://rehvo.in/sitemap-pg.xml',
    'https://rehvo.in/sitemap-commercial.xml',
    'https://rehvo.in/sitemap-showreels.xml',
    'https://rehvo.in/video-sitemap.xml',
    'https://rehvo.in/image-sitemap.xml',
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${childSitemaps
  .map(
    (url) => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
