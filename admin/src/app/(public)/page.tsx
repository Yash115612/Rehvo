import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Search, ShieldCheck, MapPin, Building, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getPublishedProperties, getPublishedFlatmates } from '../../lib/seo/queries';
import { constructSeoMetadata } from '../../lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema } from '../../lib/seo/schema';
import { JsonLd } from '../../components/public/JsonLd';
import { PropertyCard } from '../../components/public/PropertyCard';
import { LocalityCard } from '../../components/public/LocalityCard';
import { FlatmateCard } from '../../components/public/FlatmateCard';
import { AppDownloadBanner } from '../../components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, generatePropertySlug } from '../../lib/seo/slugs';

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = constructSeoMetadata({
  title: 'Flats & Rooms for Rent in Mumbai | Zero Brokerage Rentals',
  description:
    'Discover verified 1, 2, 3 BHK flats, private rooms, PGs & flatmates for rent in Mumbai with zero brokerage. Direct owner chat and scheduled visits on REHVO.',
  canonicalUrl: 'https://rehvo.com',
});

export default async function HomePage() {
  const [{ properties, totalCount }, flatmates] = await Promise.all([
    getPublishedProperties({ city: 'Mumbai', limit: 6 }),
    getPublishedFlatmates('Mumbai'),
  ]);

  const featuredLocalities = Object.entries(MUMBAI_LOCALITIES).slice(0, 8);

  const orgSchema = generateOrganizationSchema();
  const itemListSchema = generateItemListSchema(
    'Featured Zero-Brokerage Properties in Mumbai',
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
      price: p.price,
    }))
  );

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-950 via-stone-900 to-stone-900 text-white pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Zero-Brokerage Verified Platform
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Rent Verified Homes & Find Flatmates in <span className="text-purple-400">Mumbai</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Connect directly with verified property owners and compatible roommates across Mumbai. No brokers, no spam, zero hidden fees.
            </p>

            {/* Quick Category Jump Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              <Link
                href="/mumbai"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm transition flex items-center gap-1.5"
              >
                <Building className="w-3.5 h-3.5 text-purple-400" />
                Flats in Mumbai
              </Link>
              <Link
                href="/mumbai/andheri-west"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm transition flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                Andheri West
              </Link>
              <Link
                href="/mumbai/bandra-west"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm transition flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                Bandra West
              </Link>
              <Link
                href="/flatmates/mumbai"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm transition flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Find Flatmates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1.5">
              <Sparkles className="w-4 h-4" /> Live Inventory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Verified Rental Properties in Mumbai
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Browse {totalCount > 0 ? `${totalCount}+` : 'curated'} verified flats, rooms, and studios ready for immediate move-in.
            </p>
          </div>
          <Link
            href="/mumbai"
            className="mt-4 md:mt-0 text-sm font-bold text-purple-600 hover:text-purple-800 transition inline-flex items-center gap-1"
          >
            Explore all in Mumbai <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} priority={idx < 3} />
            ))}
          </div>
        ) : (
          <div className="bg-stone-50 rounded-2xl p-12 text-center border border-stone-200">
            <Building className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-900">Discover Mumbai Listings</h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto mt-1 mb-6">
              New zero-brokerage homes are verified and added daily across Andheri, Bandra, Powai, and South Mumbai.
            </p>
            <Link
              href="/mumbai"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition"
            >
              Browse Mumbai Rentals
            </Link>
          </div>
        )}
      </section>

      {/* Popular Localities Section */}
      <section className="bg-stone-100/60 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1.5">
              Explore by Neighbourhood
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Popular Rental Hubs in Mumbai
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Compare rental rates, connectivity, and direct owner listings in Mumbai&apos;s most sought-after localities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {featuredLocalities.map(([slug, info]) => (
              <LocalityCard
                key={slug}
                name={info.name}
                slug={slug}
                zone={info.zone}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/mumbai"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-purple-600 transition bg-white px-5 py-2.5 rounded-full border border-stone-200 shadow-sm"
            >
              View all 20+ Mumbai localities →
            </Link>
          </div>
        </div>
      </section>

      {/* Flatmates Discovery Section */}
      {flatmates.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 mb-1.5">
                <Users className="w-4 h-4" /> Roommate Discovery
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Verified Flatmates in Mumbai
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Find compatible working professionals and students looking for rooms and flat sharing.
              </p>
            </div>
            <Link
              href="/flatmates/mumbai"
              className="mt-4 md:mt-0 text-sm font-bold text-purple-600 hover:text-purple-800 transition inline-flex items-center gap-1"
            >
              See all flatmates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flatmates.slice(0, 3).map((flatmate) => (
              <FlatmateCard key={flatmate.id} flatmate={flatmate} />
            ))}
          </div>
        </section>
      )}

      {/* Value Propositions / Why REHVO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Why Renters & Owners Choose REHVO
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Traditional renting in Mumbai costs 1-2 months of brokerage and endless broker calls. REHVO removes the friction entirely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Zero Brokerage Guaranteed</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every property on REHVO is posted directly by homeowners or flatmates. Save ₹30,000 to ₹1,00,000+ on brokerage fees on every rental.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Government ID Verified Profiles</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                We verify user identity, contact authenticity, and listing ownership so you can connect with trust and peace of mind.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Instant Chat & Scheduled Visits</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Message hosts directly, ask questions about maintenance and house rules, and schedule confirmed property tours in one tap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download App CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppDownloadBanner />
      </div>
    </>
  );
}
