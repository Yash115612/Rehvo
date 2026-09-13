import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getPublishedFlatmates } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { FlatmatesContainer } from '@/components/flatmates/FlatmatesContainer';
import { FlatmateCardSkeleton } from '@/components/flatmates/FlatmateCardSkeleton';
import { JsonLd } from '@/components/public/JsonLd';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/seo/schema';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export const revalidate = 60;

export const metadata: Metadata = constructSeoMetadata({
  title: 'Find Verified Flatmates & Roommates in Mumbai | REHVO VibeMatch',
  description:
    'Discover compatible flatmates in Mumbai. Filter by lifestyle preferences, budget, occupation, and dietary habits with verified marketplace on REHVO.',
  canonicalUrl: 'https://rehvo.in/flatmates',
});

export default async function FlatmatesPage() {
  const flatmates = await getPublishedFlatmates('Mumbai');
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Flatmates', url: '/flatmates' },
  ]);
  const orgSchema = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-10">
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumb items={[{ name: 'Flatmates', url: '/flatmates' }]} />
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <FlatmateCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <FlatmatesContainer initialFlatmates={flatmates} />
        </Suspense>

        <div className="pt-8">
          <InternalLinksGrid currentCity="mumbai" />
        </div>
      </div>
    </div>
  );
}
