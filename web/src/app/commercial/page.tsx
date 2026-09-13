import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { CommercialPageClient } from '@/components/commercial/CommercialPageClient';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export const revalidate = 60;

export const metadata: Metadata = constructSeoMetadata({
  title: 'Commercial Offices, Retail Shops & Coworking in Mumbai | REHVO Verified Listing',
  description:
    'Lease verified corporate offices, plug-and-play IT workspaces, high-street retail shops and showrooms across Mumbai with verified marketplace. Direct landlord negotiations on REHVO.',
  canonicalUrl: 'https://rehvo.in/commercial',
});

export default async function CommercialPage() {
  const { properties } = await getPublishedProperties({
    category: 'commercial',
    limit: 30,
  });

  const orgSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Commercial Spaces', url: '/commercial' },
  ]);
  const itemListSchema = generateItemListSchema(
    properties,
    'Verified Commercial Offices & Retail in Mumbai — REHVO'
  );

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <CommercialPageClient initialProperties={properties} />
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </>
  );
}
