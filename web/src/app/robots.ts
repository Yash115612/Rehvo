import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const publicAllowedPaths = [
    '/',
    '/property/',
    '/rent/',
    '/blog/',
    '/stories/',
    '/reports/',
    '/mumbai/',
    '/pune/',
    '/bangalore/',
    '/hyderabad/',
    '/delhi/',
    '/flatmates/',
    '/pg/',
    '/commercial/',
    '/society-services/',
    '/showreels/',
    '/ai-concierge/',
    '/safety/',
    '/download/',
    '/about/',
    '/contact/',
    '/privacy/',
    '/terms/',
    '/careers/',
  ];

  const restrictedPaths = [
    '/admin/',
    '/api/',
    '/profile/',
    '/favorites/',
    '/list-property/',
    '/login/',
    '/signup/',
    '/verify-phone/',
    '/forgot-password/',
    '/checkout/',
    '/private/',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: publicAllowedPaths,
        disallow: restrictedPaths,
      },
      {
        userAgent: 'GPTBot',
        allow: publicAllowedPaths,
        disallow: restrictedPaths,
      },
      {
        userAgent: 'ClaudeBot',
        allow: [
          '/',
          '/property/',
          '/rent/',
          '/blog/',
          '/stories/',
          '/reports/',
          '/mumbai/',
          '/pune/',
          '/bangalore/',
          '/hyderabad/',
          '/delhi/',
          '/flatmates/',
          '/pg/',
          '/commercial/',
        ],
        disallow: restrictedPaths,
      },
      {
        userAgent: 'PerplexityBot',
        allow: publicAllowedPaths,
        disallow: restrictedPaths,
      },
      {
        userAgent: 'Google-Extended',
        allow: publicAllowedPaths,
        disallow: restrictedPaths,
      },
      {
        userAgent: 'CCBot',
        allow: publicAllowedPaths,
        disallow: restrictedPaths,
      },
      {
        userAgent: 'Applebot',
        allow: publicAllowedPaths,
        disallow: restrictedPaths,
      },
    ],
    sitemap: [
      'https://rehvo.in/sitemap.xml',
      'https://rehvo.in/sitemap-index.xml',
    ],
    host: 'https://rehvo.in',
  };
}

