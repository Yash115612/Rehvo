import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { ExplorePageClient } from '@/components/explore/ExplorePageClient';

export const revalidate = 60;

interface ExplorePageProps {
  searchParams: {
    locality?: string;
    city?: string;
    category?: 'residential' | 'commercial' | 'all';
    type?: string;
    bhk?: string;
    bedrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    furnishing?: string;
    sort?: string;
  };
}

export async function generateMetadata({ searchParams }: ExplorePageProps): Promise<Metadata> {
  const loc = searchParams.locality || searchParams.city || 'Mumbai';
  return constructSeoMetadata({
    title: `Explore Properties for Rent in ${loc} | Verified Listings | REHVO`,
    description: `Explore verified flats, apartments, and rental homes in ${loc} with direct owner contact, Zero Commission, and transparent deposit terms on REHVO.`,
    canonicalUrl: 'https://rehvo.in/explore',
    keywords: [
      'explore properties mumbai',
      'flats for rent mumbai',
      'verified rentals',
      'zero commission rent',
      'apartments in mumbai',
      'rehvo explore',
    ],
  });
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const maxPriceNum = searchParams.maxPrice ? parseInt(searchParams.maxPrice, 10) : undefined;
  const minPriceNum = searchParams.minPrice ? parseInt(searchParams.minPrice, 10) : undefined;

  const { properties, totalCount } = await getPublishedProperties({
    category: searchParams.category || 'all',
    city: searchParams.city || 'Mumbai',
    locality: searchParams.locality,
    type: searchParams.type,
    bedrooms: searchParams.bhk || searchParams.bedrooms,
    minPrice: minPriceNum,
    maxPrice: maxPriceNum,
    furnishing: searchParams.furnishing,
    limit: 60,
  });

  const breadcrumbs = [
    { name: 'Explore Properties', url: '/explore' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Explore Properties', url: '/explore' },
  ]);

  const itemListSchema = generateItemListSchema(
    'Explore Rental Properties in Mumbai',
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }))
  );

  return (
    <div className="w-full bg-[#F7F9FC]">
      {/* Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Main Explore Client Orchestrator with Integrated Navy Breadcrumbs */}
      <ExplorePageClient
        initialProperties={properties}
        serverTotalCount={totalCount}
        initialParams={searchParams}
        breadcrumbs={breadcrumbs}
      />

      {/* Internal Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
