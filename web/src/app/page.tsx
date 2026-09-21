import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateItemListSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';

// REHVO App-Mirrored Desktop Landing Page Components (Strict Hierarchy)
import { HeroSearch } from '@/components/v10/HeroSearch';
import { RentPropertiesGrid } from '@/components/v10/RentPropertiesGrid';
import { ExploreServices } from '@/components/v10/ExploreServices';
import { BenefitsStrip } from '@/components/v10/BenefitsStrip';
import { HostAndEarn } from '@/components/v10/HostAndEarn';
import { TrustAndRateUs } from '@/components/v10/TrustAndRateUs';
import { FeaturedProperties } from '@/components/v10/FeaturedProperties';
import { FlatmatesSection } from '@/components/v10/FlatmatesSection';
import { AIConciergeBanner } from '@/components/v10/AIConciergeBanner';
import { TrendingLocalities } from '@/components/v10/TrendingLocalities';
import { SocietyPromoSection } from '@/components/v10/SocietyPromoSection';
import { DownloadAppCTA } from '@/components/v10/DownloadAppCTA';
import { ShowreelSection } from '@/components/v10/ShowreelSection';
import { SocialCommunitySection } from '@/components/v10/SocialCommunitySection';

export const revalidate = 60; // 60s ISR

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO — Zero Commission Rentals, Verified Homes & Flatmates in Mumbai',
  description:
    'Discover verified 1, 2, 3 BHK flats, commercial spaces, PGs & flatmates for rent in Mumbai with verified marketplace. Direct owner chat, confirmed physical visits, and transparent pricing.',
  canonicalUrl: 'https://rehvo.in',
  sameAs: ['https://www.instagram.com/rehvo.in?stkn=MW5jZ2x6b2xwbTJrbA=='],
  openGraph: {
    title: 'REHVO — Zero Commission Rentals, Verified Homes & Flatmates',
    description:
      'Find verified flats, flatmates, PGs and Zero Commission homes across Mumbai with REHVO.',
    url: 'https://rehvo.in',
    images: ['/og-image.png'],
  },
});

export default async function HomePage() {
  // Fetch real published properties from Supabase backend
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

      {/* 01: UNIFIED HERO AD STAGE + SEARCH PILL + LOCALITY SELECTOR */}
      <HeroSearch />

      {/* 02: RENT PROPERTIES (3 ASYMMETRIC APP CATEGORY CARDS) */}
      <RentPropertiesGrid />

      {/* 03: EXPLORE SERVICES (ZOOMCAR-INSPIRED 6-CARD ECOSYSTEM) */}
      <ExploreServices />

      {/* 04: BENEFITS 3-PILL STRIP (R-CASH, REWARDS, SHARE & EARN) */}
      <BenefitsStrip />

      {/* 05: HOST AND EARN + INTERACTIVE RENTAL YIELD ESTIMATOR */}
      <HostAndEarn />

      {/* 06: LOVING REHVO APP? RATE US + 4 TRUST PILLARS */}
      <TrustAndRateUs />

      {/* 06.5: SHOWREEL — Auto-playing infinite video reel */}
      <ShowreelSection />

      {/* 07: FEATURED & HIGH DEMAND HOMES (CAROUSEL) */}
      <FeaturedProperties properties={featuredListings} />

      {/* 08: FIND YOUR IDEAL FLATMATE (VIBEMATCH OS) */}
      <FlatmatesSection />

      {/* 09: REHVO AI CONCIERGE OPERATING SYSTEM BANNER */}
      <AIConciergeBanner />

      {/* 10: TRENDING LOCALITIES IN MUMBAI */}
      <TrendingLocalities />

      {/* 11: SMART SOCIETY MANAGEMENT FOR APARTMENTS & RWAS */}
      <SocietyPromoSection />

      {/* 12: DOWNLOAD MOBILE APP CTA */}
      <DownloadAppCTA />

      {/* 13: REHVO INSTAGRAM SOCIAL COMMUNITY SECTION */}
      <SocialCommunitySection />
    </>
  );
}
