import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/lib/seo/blogData';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export async function GET() {
  const pages = [
    { url: `${BASE_URL}`, priority: '1.0', changefreq: 'daily' },
    { url: `${BASE_URL}/rent`, priority: '0.95', changefreq: 'daily' },
    { url: `${BASE_URL}/search`, priority: '0.95', changefreq: 'daily' },
    { url: `${BASE_URL}/flatmates`, priority: '0.9', changefreq: 'daily' },
    { url: `${BASE_URL}/pg`, priority: '0.9', changefreq: 'daily' },
    { url: `${BASE_URL}/commercial`, priority: '0.9', changefreq: 'daily' },
    { url: `${BASE_URL}/society-services`, priority: '0.85', changefreq: 'weekly' },
    { url: `${BASE_URL}/showreels`, priority: '0.85', changefreq: 'weekly' },
    { url: `${BASE_URL}/ai-concierge`, priority: '0.8', changefreq: 'weekly' },
    { url: `${BASE_URL}/zero-brokerage`, priority: '0.8', changefreq: 'weekly' },
    { url: `${BASE_URL}/safety`, priority: '0.7', changefreq: 'monthly' },
    { url: `${BASE_URL}/download`, priority: '0.8', changefreq: 'monthly' },
    { url: `${BASE_URL}/about`, priority: '0.6', changefreq: 'monthly' },
    { url: `${BASE_URL}/contact`, priority: '0.6', changefreq: 'monthly' },
    { url: `${BASE_URL}/blog`, priority: '0.85', changefreq: 'daily' },
  ];

  Object.keys(BLOG_POSTS).forEach((slug) => {
    pages.push({
      url: `${BASE_URL}/blog/${slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    });
  });

  const now = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
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
