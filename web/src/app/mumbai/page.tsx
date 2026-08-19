import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building, MapPin, ShieldCheck, Filter, Sparkles } from 'lucide-react';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { PropertyCard } from '@/components/public/PropertyCard';
import { LocalityCard } from '@/components/public/LocalityCard';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { HeroSearch } from '@/components/public/HeroSearch';
import { MUMBAI_LOCALITIES, generatePropertySlug } from '@/lib/seo/slugs';

export const revalidate = 60;

export const metadata: Metadata = constructSeoMetadata({
  title: 'Flats, Rooms & PG for Rent in Mumbai | Zero Brokerage Rentals',
  description:
    'Browse verified 1, 2, 3 BHK apartments, rooms & PGs for rent across Mumbai. Zero brokerage fees, direct owner chats, and verified property visits with REHVO.',
  canonicalUrl: 'https://rehvo.com/mumbai',
});

interface MumbaiPageProps {
  searchParams: { type?: string; locality?: string };
}

export default async function MumbaiCityPage({ searchParams }: MumbaiPageProps) {
  const selectedType = searchParams.type as any;
  const selectedLocality = searchParams.locality;

  const { properties, totalCount } = await getPublishedProperties({
    city: 'Mumbai',
    locality: selectedLocality,
    type: selectedType,
    limit: 24,
  });

  const breadcrumbs = [{ name: 'Mumbai Rentals', url: '/mumbai' }];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(
    'Rental Properties in Mumbai',
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
      price: p.price,
    }))
  );

  const localities = Object.entries(MUMBAI_LOCALITIES);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* City Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mt-4 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero Brokerage Market
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Flats, Rooms & PGs for Rent in Mumbai
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
              Explore {totalCount} verified homes available directly from homeowners. Save 100% on brokerage fees and schedule confirmed property tours across Western Suburbs, South Mumbai, and Central Hubs.
            </p>
          </div>

          <HeroSearch />

          {/* Quick Filter Sub-Navigation */}
          <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <Link
              href="/mumbai"
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                !selectedType
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              All Types ({totalCount})
            </Link>
            <Link
              href="/mumbai?type=flat"
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                selectedType === 'flat'
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Flats & Apartments
            </Link>
            <Link
              href="/mumbai?type=room"
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                selectedType === 'room'
                  ? 'bg-purple-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              Private Rooms
            </Link>
            <Link
              href="/pg/mumbai"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              PG & Co-Living
            </Link>
            <Link
              href="/flatmates/mumbai"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              Flatmates
            </Link>
          </div>
        </div>

        {/* Listings Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              {selectedType
                ? `${selectedType.toUpperCase()}s Available in Mumbai`
                : 'Available Rental Listings'}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              Showing {properties.length} of {totalCount} properties
            </span>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} priority={idx < 3} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <Building className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">No properties found in this filter</h3>
              <p className="text-xs text-stone-500 mt-1 mb-4">
                Try expanding your search to all property types or exploring nearby localities.
              </p>
              <Link
                href="/mumbai"
                className="inline-block bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Reset Filters
              </Link>
            </div>
          )}
        </section>

        {/* Top Localities in Mumbai */}
        <section className="my-16">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-stone-900">
              Explore Mumbai by Neighbourhood
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Select a locality to view detailed rent breakdowns, connectivity, and direct owner listings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {localities.map(([slug, info]) => (
              <LocalityCard key={slug} name={info.name} slug={slug} zone={info.zone} />
            ))}
          </div>
        </section>

        {/* People-First Guide: Renting in Mumbai */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 mb-16 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Guide: How to Rent in Mumbai without Paying Brokerage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-600 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">1. Typical Rent & Deposit Norms in Mumbai</h3>
              <p>
                In Mumbai, residential security deposits typically range from 2 to 4 months of monthly rent for 1 BHK and 2 BHK apartments. On REHVO, all listings are verified directly with owners, avoiding arbitrary broker markups.
              </p>
              <p>
                Maintenance charges are usually included in the stated rent or specified separately. Always verify society maintenance inclusion before signing the agreement.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">2. Connectivity & Commute Considerations</h3>
              <p>
                When choosing a rental locality in Mumbai, consider proximity to the Mumbai Metro (Line 1, 2A, 7) and Western/Central Railway lines. Localities like Andheri West, Powai, and Goregaon offer strong transit links to major corporate hubs like BKC, Nesco, and SEEPZ.
              </p>
              <p>
                Use REHVO to chat directly with owners, clarify move-in dates, and book physical visits without paying token advance fees to unverified brokers.
              </p>
            </div>
          </div>
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
