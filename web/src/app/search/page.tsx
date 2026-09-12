import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { SearchPageClient } from '@/components/search/SearchPageClient';

export const revalidate = 60;

interface SearchPageProps {
  searchParams: {
    locality?: string;
    category?: 'residential' | 'commercial' | 'all';
    type?: string;
    bedrooms?: string;
    maxPrice?: string;
    sort?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const loc = searchParams.locality || 'Mumbai';
  return constructSeoMetadata({
    title: `Flats & Properties for Rent in ${loc} | Verified Marketplace | REHVO`,
    description: `Search verified flats, commercial spaces & rooms for rent in ${loc} with verified marketplace and direct landlord contact.`,
    canonicalUrl: `https://rehvo.in/search${searchParams.locality ? `?locality=${searchParams.locality}` : ''}`,
  });
}

export default async function PropertySearchPage({ searchParams }: SearchPageProps) {
  const maxPriceNum = searchParams.maxPrice ? parseInt(searchParams.maxPrice, 10) : undefined;

  const { properties, totalCount } = await getPublishedProperties({
    category: searchParams.category || 'all',
    locality: searchParams.locality,
    type: searchParams.type,
    bedrooms: searchParams.bedrooms,
    maxPrice: maxPriceNum,
    limit: 60,
  });

  return (
    <SearchPageClient
      initialProperties={properties}
      serverTotalCount={totalCount}
      initialParams={searchParams}
    />
  );
}
