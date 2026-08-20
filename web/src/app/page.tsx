import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties, getPublishedFlatmates } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';

// New Bespoke Homepage Presentation Modules from src/components/home/
import { Hero } from '@/components/home/Hero';
import { SearchDock } from '@/components/home/SearchDock';
import { TrustStrip } from '@/components/home/TrustStrip';
import { Locations } from '@/components/home/Locations';
import { PropertyShowcase } from '@/components/home/PropertyShowcase';
import { Categories } from '@/components/home/Categories';
import { FlatmateShowcase } from '@/components/home/FlatmateShowcase';
import { WhyRehvo } from '@/components/home/WhyRehvo';
import { HowItWorks } from '@/components/home/HowItWorks';
import { HostCTA } from '@/components/home/HostCTA';
import { AppShowcase } from '@/components/home/AppShowcase';
import { FinalCTA } from '@/components/home/FinalCTA';

export const revalidate = 60; // 60s Incremental Static Regeneration

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO — Zero-Brokerage Verified Rentals & Flatmates in Mumbai',
  description:
    'Discover verified 1, 2, 3 BHK apartments, single rooms, PGs and flatmates across Mumbai with zero brokerage. Direct owner chat, confirmed physical visits, and transparent pricing.',
  canonicalUrl: 'https://rehvo.com',
});

export default async function HomePage() {
  const [{ properties: featuredProperties, totalCount }, flatmates] = await Promise.all([
    getPublishedProperties({ city: 'Mumbai', limit: 8 }),
    getPublishedFlatmates('Mumbai'),
  ]);

  const orgSchema = generateOrganizationSchema();
  const itemListSchema = generateItemListSchema(
    featuredProperties,
    'Featured Zero-Brokerage Properties in Mumbai'
  );

  const primaryProperty = featuredProperties[0] || null;

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema} />

      {/* 1. EDITORIAL REAL ESTATE COVER HERO (40% Left Typography / 60% Right Visual) */}
      <Hero primaryProperty={primaryProperty} />

      {/* 2. FLOATING SEARCH DOCK OVERLAPPING LOWER HERO */}
      <SearchDock />

      {/* 3. COMPACT TRUST STRIP WITH THIN DIVIDERS */}
      <TrustStrip />

      {/* 4. POPULAR LOCATIONS (1 Large Featured + 4 Smaller Locality Hubs) */}
      <Locations />

      {/* 5. EDITORIAL PROPERTY SHOWCASE (1 Large + 2 Stacked + 1 Wide Below) */}
      <PropertyShowcase properties={featuredProperties} totalCount={totalCount} />

      {/* 6. BROWSE BY PROPERTY TYPE (5 Large Visual Panels: Flats, Rooms, PG...) */}
      <Categories />

      {/* 7. FLATMATE DISCOVERY (Social Style Human Layout) */}
      <FlatmateShowcase flatmates={flatmates} />

      {/* 8. WHY REHVO (Midnight #121118 Statement Typography & 4 Rows) */}
      <WhyRehvo />

      {/* 9. HOW IT WORKS (Horizontal Story: 01, 02, 03) */}
      <HowItWorks />

      {/* 10. LIST YOUR PROPERTY (Obsidian #171522 Split Section for Homeowners) */}
      <HostCTA />

      {/* 11. REHVO MOBILE APP SHOWCASE */}
      <AppShowcase />

      {/* 12. FINAL CLOSING CTA (Midnight #0E0D14 Canvas) */}
      <FinalCTA />
    </>
  );
}
