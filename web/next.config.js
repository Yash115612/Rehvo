const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  distDir: "dist",
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
      '@/lib/supabase/client$': path.resolve(__dirname, 'src/lib/supabase/client.ts'),
      '@/lib/supabase/client': path.resolve(__dirname, 'src/lib/supabase/client.ts'),
      '@/lib/supabase/server$': path.resolve(__dirname, 'src/lib/supabase/server.ts'),
      '@/lib/supabase/server': path.resolve(__dirname, 'src/lib/supabase/server.ts'),
    };
    return config;
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xoskechmxzgfajkfpssv.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.rehvo.in' }],
        destination: 'https://rehvo.in/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Global Base Security Headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Strict Content-Type and Caching for XML Sitemaps
      {
        source: '/(.*).xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
      // Strict Content-Type and Caching for Robots.txt
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
      // Manifest & PWA Cache
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      // Brand Logos and Static Favicons Cache
      {
        source: '/(rehvo-logo.png|rehvo-logo-white.png|icon.png|favicon.ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
