import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/mumbai',
          '/mumbai/*',
          '/property/*',
          '/flatmates',
          '/flatmates/*',
          '/pg/*',
          '/rooms/*',
          '/studios/*',
          '/localities',
          '/compare/*',
          '/about',
          '/contact',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/login',
          '/signup',
          '/forgot-password',
          '/saved',
          '/profile',
          '/enquiries',
          '/visits',
          '/chat',
          '/chat/*',
          '/notifications',
          '/settings',
          '/owner',
          '/owner/*',
          '/flatmates/create',
          '/flatmates/profile',
          '/flatmates/edit',
          '/auth/*',
          '/api/*',
          '/*?*', // Disallow crawling query parameters to prevent duplicate indexing
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/login',
          '/signup',
          '/forgot-password',
          '/saved',
          '/profile',
          '/enquiries',
          '/visits',
          '/chat',
          '/chat/*',
          '/notifications',
          '/settings',
          '/owner',
          '/owner/*',
          '/flatmates/create',
          '/flatmates/profile',
          '/flatmates/edit',
          '/auth/*',
          '/api/*',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
