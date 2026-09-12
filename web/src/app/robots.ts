import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/search',
          '/property/*',
          '/flatmates',
          '/services',
          '/society-services',
          '/ai-concierge',
          '/about',
          '/careers',
          '/contact',
          '/download',
          '/help',
          '/privacy',
          '/terms',
          '/list-property',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
