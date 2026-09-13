import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { PGPageClient } from '@/components/pg/PGPageClient';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export const revalidate = 60;

export const metadata: Metadata = constructSeoMetadata({
  title: 'PG & Hostels in Mumbai with Verified Listing | REHVO Student & Co-Living',
  description:
    'Discover verified boys, girls & co-living PGs and hostels in Mumbai with verified marketplace. Direct warden contact, daily home-cooked meals, 300 Mbps WiFi & biometric security.',
  canonicalUrl: 'https://rehvo.in/pg',
});

export default async function PGPage() {
  const { properties } = await getPublishedProperties({
    type: 'pg',
    limit: 30,
  });

  const orgSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'PG & Hostels', url: '/pg' },
  ]);
  const itemListSchema = generateItemListSchema(
    properties,
    'Verified PGs & Hostels in Mumbai — REHVO'
  );

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <PGPageClient initialProperties={properties} />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </>
  );
}
