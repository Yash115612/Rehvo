import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const content = `# REHVO Production Robots Configuration
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/private/
Disallow: /auth/
Disallow: /wallet/
Disallow: /profile/

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://rehvo.in/sitemap.xml
Host: rehvo.in
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Robots-Tag': 'all',
    },
  });
}
