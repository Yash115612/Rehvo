import type { PublicProperty } from './queries';
import { generatePropertySlug } from './slugs';
import type { LocalityProfile } from './localityData';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.in';

/**
 * 1. Schema.org Organization for REHVO
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'RealEstateAgent'],
    '@id': `${BASE_URL}/#organization`,
    name: 'REHVO',
    legalName: 'Rehvo Technologies Private Limited',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/logo.png`,
    description: 'India’s premier verified rental marketplace with AI concierge, direct owner connections, zero brokerage, flatmates, and PGs.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bandra West & Andheri West Tech Corridor',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400050',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-8208662286',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
    sameAs: [
      'https://www.instagram.com/rehvo.in?stkn=MW5jZ2x6b2xwbTJrbA==',
      'https://instagram.com/rehvo.in',
      'https://twitter.com/rehvoapp',
      'https://linkedin.com/company/rehvo',
      'https://facebook.com/rehvoapp',
      'https://youtube.com/@rehvo',
    ],
  };
}

/**
 * 2. Schema.org WebSite with SearchAction
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'REHVO',
    alternateName: 'REHVO Rentals & Flatmates',
    description: 'Verified rental marketplace for apartments, rooms, PGs, and commercial real estate across Mumbai and India.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 3. Schema.org BreadcrumbList
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
    })),
  };
}

/**
 * 4. Schema.org FAQPage for rich search engine expandable snippets
 */
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export const generateFAQSchema = generateFaqSchema;


export interface VerifiedReview {
  id: string;
  author: string;
  rating: number;
  review: string;
  createdAt: string;
  verified: boolean;
}

/**
 * Builds review and aggregateRating schema strictly from verified reviews.
 * Returns null if no verified reviews exist or array is empty.
 * Never emits fabricated or hardcoded review markup.
 */
export function buildReviewSchema(verifiedReviews?: VerifiedReview[] | null): {
  review: Array<{
    '@type': 'Review';
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating: 5;
      worstRating: 1;
    };
    reviewBody: string;
    datePublished: string;
  }>;
  aggregateRating: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    ratingCount: number;
    bestRating: 5;
    worstRating: 1;
  };
} | null {
  if (!Array.isArray(verifiedReviews) || verifiedReviews.length === 0) {
    return null;
  }

  // Filter for valid verified reviews with non-empty review text and positive rating
  const validReviews = verifiedReviews.filter(
    (r) => r && r.verified && typeof r.rating === 'number' && r.rating >= 1 && r.rating <= 5 && r.review && r.review.trim()
  );

  if (validReviews.length === 0) {
    return null;
  }

  const sum = validReviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = Math.round((sum / validReviews.length) * 10) / 10;

  return {
    review: validReviews.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author || 'Verified Resident',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: r.review.trim(),
      datePublished: r.createdAt || '2026-01-01',
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg,
      reviewCount: validReviews.length,
      ratingCount: validReviews.length,
      bestRating: 5,
      worstRating: 1,
    },
  };
}

/**
 * Schema.org ImageObject
 */
export function generateImageObject(
  url: string,
  caption?: string,
  width?: number,
  height?: number,
  representativeOfPage?: boolean
) {
  const safeUrl = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: safeUrl,
    contentUrl: safeUrl,
    ...(caption ? { caption } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(typeof representativeOfPage === 'boolean' ? { representativeOfPage } : {}),
  };
}

/**
 * 5. Schema.org RealEstateListing + Accommodation for Property Pages
 */
export function generatePropertySchema(property: PublicProperty, canonicalUrl: string) {
  const rawImages = (property.property_images || [])
    .filter((img) => img && typeof img.image_url === 'string' && img.image_url.startsWith('https://'))
    .map((img) => img.image_url);
  const coverImage = rawImages[0] || `${BASE_URL}/og-default.jpg`;
  const images = rawImages.length > 0 ? rawImages : [coverImage];

  const imageObjects = images.map((imgUrl, idx) =>
    generateImageObject(
      imgUrl,
      `${property.title} - Photo ${idx + 1}`,
      1200,
      800,
      idx === 0
    )
  );

  let accommodationType = 'Apartment';
  if ((property as any).type === 'room') accommodationType = 'Room';
  if ((property as any).type === 'studio') accommodationType = 'Studio';
  if ((property as any).type === 'villa' || (property as any).type === 'house') accommodationType = 'House';

  const reviewsData = (property as any).verifiedReviews || (property as any).reviews;
  const reviewSchema = buildReviewSchema(reviewsData);

  return {
    '@context': 'https://schema.org',
    '@type': ['RealEstateListing', accommodationType],
    '@id': canonicalUrl,
    name: property.title,
    description: property.description,
    url: canonicalUrl,
    image: images,
    photo: imageObjects,
    primaryImageOfPage: imageObjects[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address || property.locality,
      addressLocality: property.locality,
      addressRegion: property.state || 'Maharashtra',
      postalCode: '400053',
      addressCountry: 'IN',
    },
    geo:
      property.latitude && property.longitude
        ? {
            '@type': 'GeoCoordinates',
            latitude: property.latitude,
            longitude: property.longitude,
          }
        : undefined,
    numberOfRooms: property.bedrooms ? parseInt(String(property.bedrooms)) || 1 : 1,
    numberOfBathroomsTotal: property.bathrooms || 1,
    floorSize: property.area
      ? {
          '@type': 'QuantitativeValue',
          value: property.area,
          unitCode: 'FTK', // Square Foot
        }
      : undefined,
    amenityFeature: (property.amenities || []).map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity,
      value: true,
    })),
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: property.price,
        priceCurrency: 'INR',
        unitText: 'MONTH',
      },
    },
    ...(reviewSchema ? reviewSchema : {}),
  };
}

/**
 * 6. Schema.org Residence / Hostel for PG Properties
 */
export function generatePgSchema(property: any, canonicalUrl: string) {
  const images = (property.property_images || []).map((i: any) => i.image_url || i);
  return {
    '@context': 'https://schema.org',
    '@type': ['Hostel', 'Residence'],
    '@id': canonicalUrl,
    name: property.title,
    description: property.description,
    url: canonicalUrl,
    image: images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address || property.locality,
      addressLocality: property.locality,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      unitText: 'MONTH',
      availability: 'https://schema.org/InStock',
    },
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'High Speed WiFi', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Daily Meals Included', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Biometric Gate Security', value: true },
    ],
  };
}

/**
 * 7. Schema.org CommercialProperty for Offices and Retail Spaces
 */
export function generateCommercialSchema(property: any, canonicalUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Place', 'RealEstateListing'],
    '@id': canonicalUrl,
    name: property.title,
    description: property.description,
    url: canonicalUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.locality,
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      unitText: 'MONTH',
    },
  };
}

/**
 * 8. Schema.org VideoObject for ShowReels
 */
export function generateVideoObjectSchema(video: {
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl: string;
  embedUrl?: string;
  duration?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: [video.thumbnailUrl],
    uploadDate: video.uploadDate || '2026-01-01T00:00:00+05:30',
    duration: video.duration || 'PT1M30S',
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl || video.contentUrl,
    publisher: {
      '@type': 'Organization',
      name: 'REHVO',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/rehvo-logo.png`,
      },
    },
  };
}

/**
 * 9. Schema.org LocalBusiness for Society Services
 */
export function generateLocalBusinessSchema(society: {
  name: string;
  locality: string;
  city: string;
  description: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${society.name} — Smart Gate & Resident Services`,
    description: society.description,
    image: society.imageUrl || `${BASE_URL}/rehvo-logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: society.locality,
      addressLocality: society.locality,
      addressRegion: society.city,
      addressCountry: 'IN',
    },
    telephone: '+91-8208662286',
    priceRange: '₹₹',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
    ],
  };
}

/**
 * 10. Schema.org Article / BlogPosting for Editorial Guides
 */
export function generateArticleSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishDate: string;
  modifiedDate?: string;
  authorName?: string;
  imageUrl?: string;
  category?: string;
}) {
  const imageUrl = post.imageUrl || `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}`;
  const imageObject = generateImageObject(
    imageUrl,
    post.title,
    1200,
    630,
    true
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
    image: [imageUrl],
    primaryImageOfPage: imageObject,
    datePublished: post.publishDate,
    dateModified: post.modifiedDate || post.publishDate,
    author: {
      '@type': 'Person',
      name: post.authorName || 'REHVO Real Estate Research Desk',
      url: `${BASE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'REHVO',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/rehvo-logo.png`,
      },
    },
    articleSection: post.category || 'Real Estate Trends',
  };
}

/**
 * 11. Schema.org ItemList for Locality / Search listings
 */
export function generateItemListSchema(
  titleOrProperties: string | PublicProperty[],
  itemsOrTitle?: { name: string; url: string; image?: string; price?: number }[] | string
) {
  let title = 'Properties on REHVO';
  let formattedItems: { name: string; url: string; image?: string }[] = [];

  if (Array.isArray(titleOrProperties)) {
    title = typeof itemsOrTitle === 'string' ? itemsOrTitle : 'Properties on REHVO';
    formattedItems = titleOrProperties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }));
  } else {
    title = titleOrProperties;
    formattedItems = Array.isArray(itemsOrTitle) ? itemsOrTitle : [];
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    itemListElement: formattedItems.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url.startsWith('/') ? item.url : `/${item.url}`}`,
      name: item.name,
      image: item.image,
    })),
  };
}

/**
 * 12. Schema.org LocalBusiness, Place, GeoCoordinates, PostalAddress for Locality Pages
 */
export function generateLocalityEntitySchema(locality: LocalityProfile, canonicalUrl: string) {
  const lat = locality.latitude || locality.coordinates.lat;
  const lng = locality.longitude || locality.coordinates.lng;
  const pincode = locality.postalCode || locality.popularPincodes?.[0] || '400050';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        '@id': `${canonicalUrl}#place`,
        name: `${locality.name}, ${locality.city}`,
        description: locality.description,
        url: canonicalUrl,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: lat,
          longitude: lng,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: locality.name,
          addressRegion: locality.city === 'Mumbai' ? 'Maharashtra' : locality.city,
          postalCode: pincode,
          addressCountry: 'IN',
        },
        ...(locality.geoShape
          ? {
              geoShape: {
                '@type': 'GeoShape',
                polygon: locality.geoShape.coordinates[0].map((coord) => `${coord[1]},${coord[0]}`).join(' '),
              },
            }
          : {}),
      },
      {
        '@type': 'RealEstateAgent',
        '@id': `${canonicalUrl}#service`,
        name: `REHVO Verified Rentals — ${locality.name}`,
        url: canonicalUrl,
        image: `${BASE_URL}/logo.png`,
        telephone: '+91-8208662286',
        priceRange: '₹₹',
        areaServed: {
          '@type': 'AdministrativeArea',
          name: `${locality.name}, ${locality.city}`,
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: locality.name,
          addressRegion: 'Maharashtra',
          postalCode: pincode,
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: lat,
          longitude: lng,
        },
      },
    ],
  };
}

/**
 * 13. Schema.org Transit Stations & Local Landmarks for Locality Pages
 */
export function generateTransitAndLandmarkSchema(locality: LocalityProfile, canonicalUrl: string) {
  const items: any[] = [];
  const lat = locality.latitude || locality.coordinates.lat;
  const lng = locality.longitude || locality.coordinates.lng;

  // Transit stations
  if (Array.isArray(locality.transitStations)) {
    locality.transitStations.forEach((station, idx) => {
      let schemaType = 'CivicStructure';
      if (station.type === 'metro') schemaType = 'MetroStation';
      else if (station.type === 'railway') schemaType = 'TrainStation';
      else if (station.type === 'bus') schemaType = 'BusStation';

      items.push({
        '@type': schemaType,
        '@id': `${canonicalUrl}#transit-${idx + 1}`,
        name: station.name,
        containedInPlace: {
          '@type': 'Place',
          name: `${locality.name}, ${locality.city}`,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: lat,
          longitude: lng,
        },
      });
    });
  }

  // Top Schools
  if (Array.isArray(locality.topSchools)) {
    locality.topSchools.forEach((school, idx) => {
      items.push({
        '@type': 'School',
        '@id': `${canonicalUrl}#school-${idx + 1}`,
        name: school,
        address: {
          '@type': 'PostalAddress',
          addressLocality: locality.name,
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      });
    });
  }

  // Top Colleges
  if (Array.isArray(locality.topColleges)) {
    locality.topColleges.forEach((college, idx) => {
      items.push({
        '@type': 'CollegeOrUniversity',
        '@id': `${canonicalUrl}#college-${idx + 1}`,
        name: college,
        address: {
          '@type': 'PostalAddress',
          addressLocality: locality.name,
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      });
    });
  }

  // Top Hospitals
  if (Array.isArray(locality.topHospitals)) {
    locality.topHospitals.forEach((hosp, idx) => {
      items.push({
        '@type': 'Hospital',
        '@id': `${canonicalUrl}#hospital-${idx + 1}`,
        name: hosp,
        address: {
          '@type': 'PostalAddress',
          addressLocality: locality.name,
          addressRegion: 'Maharashtra',
          addressCountry: 'IN',
        },
      });
    });
  }

  // Lifestyle Hubs / Landmarks
  if (Array.isArray(locality.lifestyleHubs)) {
    locality.lifestyleHubs.forEach((hub, idx) => {
      items.push({
        '@type': 'Place',
        '@id': `${canonicalUrl}#landmark-${idx + 1}`,
        name: hub,
        containedInPlace: {
          '@type': 'Place',
          name: `${locality.name}, ${locality.city}`,
        },
      });
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': items,
  };
}

/**
 * 14. Schema.org Author & E-E-A-T Profile Schema
 */
export function generateAuthorSchema(author: {
  name: string;
  role: string;
  bio: string;
  url: string;
  image?: string;
  sameAs?: string[];
  credentials?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${author.url}#person`,
        name: author.name,
        jobTitle: author.role,
        description: author.bio,
        url: author.url,
        image: author.image || `${BASE_URL}/logo.png`,
        worksFor: {
          '@type': 'Organization',
          name: 'REHVO',
          url: BASE_URL,
        },
        knowsAbout: [
          'Mumbai Real Estate',
          'Rental Yield Analysis',
          'MahaRERA Regulations',
          'Index-II Title Verification',
          'Urban Planning & Housing Infrastructure',
        ],
        ...(author.sameAs ? { sameAs: author.sameAs } : {}),
      },
      {
        '@type': 'Organization',
        '@id': `${author.url}#publisher`,
        name: 'REHVO Editorial & Real Estate Intelligence Desk',
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        parentOrganization: {
          '@id': `${BASE_URL}/#organization`,
        },
      },
    ],
  };
}

