import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Google Search Console HTML File Verification Handler
  // Matches any /google<token>.html request dynamically
  if (pathname.startsWith('/google') && pathname.endsWith('.html')) {
    const filename = pathname.replace(/^\//, '');
    return new NextResponse(`google-site-verification: ${filename}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // 2. Immediate Bypass for Sitemaps, Robots, Feeds, and Static Data
  // Prevents CSP or security header mutation on XML/Text/JSON routes
  if (
    pathname.endsWith('.xml') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.json') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/video-sitemap') ||
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Strict Enterprise Security Headers for HTML Web Navigation
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self)'
  );

  // Content Security Policy for Production Real Estate Web Application
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://maps.googleapis.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https: https://images.unsplash.com https://*.supabase.co https://maps.gstatic.com https://maps.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube-nocookie.com;
    connect-src 'self' https: https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.clarity.ms;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - static files: favicon, xml, txt, json, images
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:xml|txt|json|png|jpg|jpeg|svg|webp|avif|ico|mp4)).*)',
  ],
};
