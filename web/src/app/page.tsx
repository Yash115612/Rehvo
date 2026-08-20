import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties, getPublishedFlatmates } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';

// Bespoke Modules built to match exact reference image
import { RehvoHero } from '@/components/home/RehvoHero';
import { PopularLocalities } from '@/components/home/PopularLocalities';
import { FeaturedHomes } from '@/components/home/FeaturedHomes';
import { BrowseCategory } from '@/components/home/BrowseCategory';
import { FindFlatmate } from '@/components/home/FindFlatmate';
import { WhyChooseRehvo } from '@/components/home/WhyChooseRehvo';
import { DualPromoSection } from '@/components/home/DualPromoSection';

export const revalidate = 60; // 60s ISR

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO — Zero-Brokerage Verified Rentals & Flatmates in Mumbai',
  description:
    'Discover verified 1, 2, 3 BHK flats, private rooms, PGs & flatmates for rent in Mumbai with zero brokerage. Direct owner chat, confirmed physical visits, and transparent pricing.',
  canonicalUrl: 'https://rehvo.com',
});

export default async function HomePage() {
  const [{ properties: featuredProperties }, flatmates] = await Promise.all([
    getPublishedProperties({ city: 'Mumbai', limit: 8 }),
    getPublishedFlatmates('Mumbai'),
  ]);

  const orgSchema = generateOrganizationSchema();
  const itemListSchema = generateItemListSchema(
    featuredProperties,
    'Featured Zero-Brokerage Properties in Mumbai'
  );

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema} />

      {/* 1. HERO + FLOATING SEARCH DOCK + TRUST BADGES */}
      <RehvoHero />

      {/* 2. POPULAR LOCALITIES (5 Locality Tiles with Counts) */}
      <PopularLocalities />

      {/* 3. PLACES WORTH SEEING (1 Large Dominant + 2 Stacked Feature Cards) */}
      <FeaturedHomes properties={featuredProperties} />

      {/* 4. BROWSE BY CATEGORY (5 Visual Category Panels with Circular Icons) */}
      <BrowseCategory />

      {/* 5. FIND YOUR FLATMATE (Left Column + 4 Social Profile Cards) */}
      <FindFlatmate flatmates={flatmates} />

      {/* 6. WHY CHOOSE REHVO? (Horizontal Warm Banner with 4 Pillars) */}
      <WhyChooseRehvo />

      {/* 7. DUAL PROMO BANNERS (Host Section on Left + App Showcase on Right) */}
      <DualPromoSection />
    </>
  );
}
