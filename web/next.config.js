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
        has: [
          {
            type: 'host',
            value: 'www.rehvo.in',
          },
        ],
        destination: 'https://rehvo.in/:path*',
        permanent: true,
      },
      {
        source: '/zero-brokerage',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/host-property',
        destination: '/list-property',
        permanent: true,
      },
      {
        source: '/hostel',
        destination: '/pg',
        permanent: true,
      },
      {
        source: '/rooms',
        destination: '/search?type=room',
        permanent: true,
      },
      {
        source: '/pg-rooms',
        destination: '/search?type=pg',
        permanent: true,
      },
      {
        source: '/owners',
        destination: '/list-property',
        permanent: true,
      },
      {
        source: '/society',
        destination: '/society-services',
        permanent: true,
      },
      {
        source: '/localities',
        destination: '/search',
        permanent: true,
      },
      {
        source: '/wallet',
        destination: '/download',
        permanent: true,
      },
      {
        source: '/rewards',
        destination: '/download',
        permanent: true,
      },
    ];
  },
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://scripts.clarity.ms https://www.clarity.ms https://maps.googleapis.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https: https://images.unsplash.com https://*.supabase.co https://maps.gstatic.com https://maps.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://c.clarity.ms;
      font-src 'self' https://fonts.gstatic.com data:;
      connect-src 'self' https: https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://*.clarity.ms https://c.clarity.ms;
      media-src 'self' blob: data: https: https://*.supabase.co https://*.clarity.ms;
      frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube-nocookie.com https://*.clarity.ms;
      worker-src 'self' blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'self';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
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
    ];
  },
};

module.exports = nextConfig;
