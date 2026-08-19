import type { PublicProperty } from './queries';
import { generatePropertySlug } from './slugs';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rehvo.com';

/** Schema.org Organization for REHVO */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'REHVO',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'Zero-Brokerage Verified Rental & Flatmate Marketplace in Mumbai, India.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://twitter.com/rehvoapp',
      'https://instagram.com/rehvoapp',
      'https://linkedin.com/company/rehvo',
    ],
  };
}

/** Schema.org BreadcrumbList */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/** Schema.org FAQPage for rich search engine Q&A snippets */
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

export function generatePropertySchema(property: PublicProperty, canonicalUrl: string) {
  const images = (property.property_images || [])
    .filter((img) => img && typeof img.image_url === 'string' && img.image_url.startsWith('https://'))
    .map((img) => img.image_url);
  const coverImage = images[0] || `${BASE_URL}/og-default.jpg`;

  let accommodationType = 'Apartment';
  if ((property as any).type === 'room') accommodationType = 'Room';
  if ((property as any).type === 'studio') accommodationType = 'Studio';

  return {
    '@context': 'https://schema.org',
    '@type': ['RealEstateListing', accommodationType],
    name: property.title,
    description: property.description,
    url: canonicalUrl,
    image: images.length > 0 ? images : [coverImage],
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
    numberOfRooms: parseInt(property.bedrooms) || 1,
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
  };
}

/** Schema.org ItemList for Locality / Search listings */
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
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
      name: item.name,
      image: item.image,
    })),
  };
}
