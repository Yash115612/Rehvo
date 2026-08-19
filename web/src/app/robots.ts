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
          '/flatmates/*',
          '/pg/*',
          '/about',
          '/contact',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/login',
          '/signup',
          '/saved',
          '/auth/*',
          '/api/*',
          '/private/*',
          '/*?*', // Disallow crawling arbitrary query parameters to avoid duplicate content indexing
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/login', '/signup', '/saved', '/auth/*', '/api/*'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
