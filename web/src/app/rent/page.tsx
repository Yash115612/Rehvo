import React from 'react';
import { Metadata } from 'next';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { generateItemListSchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { RentPageClient } from '@/components/rent/RentPageClient';

export const revalidate = 3600;

export const metadata: Metadata = constructSeoMetadata({
  title: 'Flats & Apartments for Rent in Mumbai | 100% Verified Direct Owners | REHVO',
  description:
    'Find verified 1, 2, 3 BHK rental flats, apartments, and luxury homes across Mumbai with Zero Commission, verified title deeds, upfront security deposits, and direct owner contact on REHVO.',
  canonicalUrl: 'https://rehvo.in/rent',
  keywords: [
    'flats for rent in mumbai',
    'apartments for rent mumbai',
    'Zero Commission rentals mumbai',
    'direct owner flats mumbai',
    '1 bhk for rent in mumbai',
    '2 bhk for rent in mumbai',
    '3 bhk for rent in mumbai',
    'verified rental homes mumbai',
    'rehvo rent',
  ],
});

export default async function RentPage() {
  const { properties, totalCount } = await getPublishedProperties({
    category: 'residential',
    city: 'Mumbai',
    limit: 60,
  });

  const breadcrumbs = [
    { name: 'Rentals in Mumbai', url: '/rent' },
  ];

  const itemListSchema = generateItemListSchema(
    'Flats & Apartments for Rent in Mumbai',
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }))
  );

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <div className="w-full bg-[#F7F9FC]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Main Interactive Marketplace Client with Seamless Navy Breadcrumbs */}
      <RentPageClient
        initialProperties={properties}
        initialTotalCount={totalCount}
        breadcrumbs={breadcrumbs}
      />

      {/* SEO Internal Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
