import React from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateItemListSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';

// REHVO V2 Mobile-Mirrored Homepage Components
import { HeroWithBanners } from '@/components/home/HeroWithBanners';
import { AppExploreGrid } from '@/components/home/AppExploreGrid';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { AppPgCommercialSection } from '@/components/home/AppPgCommercialSection';
import { AppFlatmateSection } from '@/components/home/AppFlatmateSection';
import { AppHostAndEarn } from '@/components/home/AppHostAndEarn';
import { DamageProtectionExplainer } from '@/components/home/DamageProtectionExplainer';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhyRehvo } from '@/components/home/WhyRehvo';
import { TrustSafety } from '@/components/home/TrustSafety';
import { AppFinalCTA } from '@/components/home/AppFinalCTA';

export const revalidate = 60; // 60s ISR

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO — India’s Zero-Brokerage Rental Marketplace & Verified Handover',
  description:
    'Find verified 1, 2, 3 BHK flats, PGs, flatmates and commercial spaces direct from homeowners. Zero brokerage with move-in condition baseline and damage protection.',
  canonicalUrl: 'https://rehvo.in',
  openGraph: {
    title: 'REHVO — Zero-Brokerage Rentals & Verified Handover',
    description:
      'Verified rental apartments, PGs, and commercial spaces with room-by-room move-in condition protection and direct owner contact.',
    url: 'https://rehvo.in',
    images: ['/og-image.png'],
  },
});

export default async function HomePage() {
  // Fetch real published properties from Supabase backend (safe read-only query)
  const { properties: featuredListings } = await getPublishedProperties({
    category: 'residential',
    city: 'Mumbai',
    limit: 12,
  });

  const itemListSchema = generateItemListSchema(
    featuredListings,
    'Featured Verified Properties in Mumbai — REHVO'
  );

  const orgSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
  ]);

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      {/* 01: Four-Banner Hero Carousel & Pill Search Experience */}
      <HeroWithBanners />

      {/* 02: App-Mirrored Pastel Explore Services Grid */}
      <AppExploreGrid />

      {/* 03: Featured Direct-Owner Listings */}
      <FeaturedListings properties={featuredListings} />

      {/* 04: PG & Co-Living and Commercial Real Estate Spotlights */}
      <AppPgCommercialSection />

      {/* 05: Flatmate Discovery & Lifestyle Match */}
      <AppFlatmateSection />

      {/* 06: Host and Earn (App Pastel Cards for Property Owners) */}
      <AppHostAndEarn />

      {/* 07: Verified Handover & Damage Protection System */}
      <DamageProtectionExplainer />

      {/* 08: How REHVO Works (Renter & Owner Journeys) */}
      <HowItWorks />

      {/* 09: The REHVO Difference (Why REHVO) */}
      <WhyRehvo />

      {/* 10: Verifiable Trust & Safety Standards */}
      <TrustSafety />

      {/* 11: Final Discovery CTA */}
      <AppFinalCTA />
    </>
  );
}
