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
  sameAs?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    images?: string[];
  };
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
  sameAs,
  openGraph: customOpenGraph,
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

  // Clean title to prevent double-branding (e.g. "About Us | REHVO | REHVO")
  // Strip trailing " | REHVO", " — REHVO", etc., so layout template "%s | REHVO" adds branding once.
  let cleanTitle = title.trim();
  const trailingPattern = /\s*[\|\—\-]\s*(?:REHVO|rehvo\.in|rehvo)\s*$/i;
  while (trailingPattern.test(cleanTitle)) {
    cleanTitle = cleanTitle.replace(trailingPattern, '').trim();
  }
  // Also strip leading "REHVO — " or "REHVO | " if title continues with descriptive text
  // e.g. "REHVO AI Concierge" is fine, but "REHVO | About" -> "About"
  cleanTitle = cleanTitle.replace(/^REHVO\s*[\|\—\-]\s*/i, '').trim() || title.trim();

  const brandedTitle = cleanTitle.toLowerCase().includes('rehvo') ? cleanTitle : `${cleanTitle} | ${SITE_NAME}`;

  const metadata: Metadata = {
    title: cleanTitle,
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
      title: customOpenGraph?.title || brandedTitle,
      description: customOpenGraph?.description || description,
      url: customOpenGraph?.url || fullCanonical,
      siteName: SITE_NAME,
      images: customOpenGraph?.images?.length
        ? customOpenGraph.images.map((img) => ({
            url: img.startsWith('http') ? img : `${BASE_URL}${img.startsWith('/') ? img : `/${img}`}`,
            width: 1200,
            height: 630,
            alt: customOpenGraph.title || cleanTitle,
          }))
        : [
            {
              url: resolvedImageUrl,
              width: 1200,
              height: 630,
              alt: cleanTitle,
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
      title: customOpenGraph?.title || brandedTitle,
      description: customOpenGraph?.description || description,
      images: customOpenGraph?.images?.length
        ? customOpenGraph.images.map((img) =>
            img.startsWith('http') ? img : `${BASE_URL}${img.startsWith('/') ? img : `/${img}`}`
          )
        : [resolvedImageUrl],
      creator: '@rehvoapp',
      site: '@rehvoapp',
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'format-detection': 'telephone=no',
      ...(sameAs?.length && {
        sameAs: JSON.stringify(sameAs),
      }),
    },
  };

  return metadata;
}
