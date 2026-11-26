import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { ExplorePageClient } from '@/components/explore/ExplorePageClient';

export const revalidate = 60;

interface SearchPageProps {
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

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const loc = searchParams.locality || searchParams.city || 'Mumbai';
  return constructSeoMetadata({
    title: `Flats & Properties for Rent in ${loc} | Verified Direct Owners | REHVO`,
    description: `Search verified flats, apartments, and rental homes in ${loc} with direct owner contact, Zero Commission, and transparent terms on REHVO.`,
    canonicalUrl: 'https://rehvo.in/search',
  });
}

export default async function PropertySearchPage({ searchParams }: SearchPageProps) {
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
    { name: 'Search Rentals', url: '/search' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Search Rentals', url: '/search' },
  ]);

  const itemListSchema = generateItemListSchema(
    'Rental Properties in Mumbai',
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }))
  );

  return (
    <div className="w-full bg-[#F7F9FC]">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
