import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';
const SITE_NAME = 'REHVO';

export interface SeoMetadataOptions {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

export function constructSeoMetadata({
  title,
  description,
  canonicalUrl,
  imageUrl,
  noIndex = false,
  type = 'website',
}: SeoMetadataOptions): Metadata {
  const fullCanonical = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `${BASE_URL}${canonicalUrl}`;

  const resolvedImageUrl =
    imageUrl ||
    `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description.slice(0, 90))}...`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: fullCanonical,
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
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [resolvedImageUrl],
      creator: '@rehvoapp',
    },
  };
}
