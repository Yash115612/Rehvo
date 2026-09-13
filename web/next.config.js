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
    ];
  },
  async headers() {
    return [
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
    ];
  },
};

module.exports = nextConfig;
