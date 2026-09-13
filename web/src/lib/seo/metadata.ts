import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';
const SITE_NAME = 'REHVO';

export interface SeoMetadataOptions {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  keywords?: string[] | string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
}

export function constructSeoMetadata({
  title,
  description,
  canonicalUrl,
  imageUrl,
  keywords,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
}: SeoMetadataOptions): Metadata {
  const fullCanonical = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `${BASE_URL}${canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`}`;

  const resolvedImageUrl =
    imageUrl ||
    `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description.slice(0, 90))}...`;

  const parsedKeywords = Array.isArray(keywords)
    ? keywords
    : typeof keywords === 'string'
    ? keywords.split(',').map((k) => k.trim())
    : [
        'verified rental marketplace',
        'direct owner flats for rent',
        'flatmates mumbai',
        'pg in mumbai',
        'commercial property rent',
        'ai property search',
        'rehvo rental',
      ];

  const metadata: Metadata = {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: parsedKeywords,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: fullCanonical,
      languages: {
        'en-IN': fullCanonical,
        'x-default': fullCanonical,
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: fullCanonical,
      siteName: SITE_NAME,
      images: [
        {
          url: resolvedImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: type === 'article' ? 'article' : 'website',
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: authors || ['REHVO Editorial Team'],
        section: section || 'Real Estate & Rentals',
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [resolvedImageUrl],
      creator: '@rehvoapp',
      site: '@rehvoapp',
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'format-detection': 'telephone=no',
    },
  };

  return metadata;
}
