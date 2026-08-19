import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Search,
  ShieldCheck,
  MapPin,
  Building,
  Building2,
  Home,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  MessageSquare,
  Zap,
  TrendingUp,
  Heart,
  Train,
  Check,
} from 'lucide-react';
import { getPublishedProperties, getPublishedFlatmates } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { PropertyCard } from '@/components/public/PropertyCard';
import { FlatmateCard } from '@/components/public/FlatmateCard';
import { HeroSearch } from '@/components/public/HeroSearch';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, generatePropertySlug } from '@/lib/seo/slugs';

export const revalidate = 60; // 60s ISR

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO — Zero-Brokerage Verified Rentals & Flatmates in Mumbai',
  description:
    'Find verified 1, 2, 3 BHK apartments, single rooms, PGs and flatmates across Mumbai with zero brokerage. Direct owner chat, confirmed physical visits, and transparent pricing.',
  canonicalUrl: 'https://rehvo.com',
});

export default async function HomePage() {
  const [{ properties: featuredProperties, totalCount }, flatmates, pgProperties] = await Promise.all([
    getPublishedProperties({ city: 'Mumbai', limit: 6 }),
    getPublishedFlatmates('Mumbai'),
    getPublishedProperties({ city: 'Mumbai', type: 'room', limit: 3 }),
  ]);

  const orgSchema = generateOrganizationSchema();
  const itemListSchema = generateItemListSchema(
    featuredProperties,
    'Featured Zero-Brokerage Properties in Mumbai'
  );

  const topLocalities = [
    { slug: 'andheri-west', name: 'Andheri West', zone: 'Western Suburbs', rent: '₹35k - ₹85k' },
    { slug: 'bandra-west', name: 'Bandra West', zone: 'Western Suburbs', rent: '₹50k - ₹1.4L' },
    { slug: 'powai', name: 'Powai', zone: 'Central Suburbs', rent: '₹32k - ₹82k' },
    { slug: 'juhu', name: 'Juhu', zone: 'Western Suburbs', rent: '₹45k - ₹1.2L' },
    { slug: 'goregaon-west', name: 'Goregaon West', zone: 'Western Suburbs', rent: '₹26k - ₹65k' },
    { slug: 'worli', name: 'Worli', zone: 'South Mumbai', rent: '₹55k - ₹1.6L' },
    { slug: 'malad-west', name: 'Malad West', zone: 'Western Suburbs', rent: '₹24k - ₹60k' },
    { slug: 'thane-west', name: 'Thane West', zone: 'Thane', rent: '₹16k - ₹40k' },
  ];

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema} />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900 text-white pt-14 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Zero Brokerage • Direct from Owners
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Find a place that feels like <span className="text-purple-400">home.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Real rentals, private rooms, PGs, and verified flatmates across Mumbai. Connect directly with owners with zero broker commission.
            </p>
          </div>

          {/* Primary Search Module */}
          <HeroSearch />

          {/* Quick Category Discovery Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
            <Link
              href="/localities"
              className="bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-sm transition flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              Explore All 20 Localities
            </Link>
          </div>
        </div>
      </section>

      {/* 2. REAL TRUST SIGNALS BAR */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-stone-900 block">Zero Brokerage</span>
              <span className="text-[11px] text-stone-500 block">100% direct owner listings</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-stone-900 block">Verified Homes</span>
              <span className="text-[11px] text-stone-500 block">Inspected photos & details</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-stone-900 block">Scheduled Visits</span>
              <span className="text-[11px] text-stone-500 block">Book confirmed site tours</span>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-stone-900 block">Direct Inquiries</span>
              <span className="text-[11px] text-stone-500 block">Chat with hosts in real-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES ("Places Worth Seeing") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-600 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Live Direct Listings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Places Worth Seeing in Mumbai
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Verified flats and rooms with transparent rents and zero middleman broker fees.
            </p>
          </div>

          <Link
            href="/mumbai"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-purple-600 transition"
          >
            <span>View all {totalCount} verified homes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property, idx) => (
              <PropertyCard key={property.id} property={property} priority={idx < 3} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Building className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">Verified properties are being published</h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Explore Mumbai neighbourhoods to find your next home.
            </p>
            <Link
              href="/localities"
              className="inline-block bg-stone-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
            >
              Browse Localities
            </Link>
          </div>
        )}
      </section>

      {/* 4. POPULAR LOCATIONS */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                Top Hubs
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Explore Popular Mumbai Localities
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Average rental benchmarks and active listings across high-demand areas.
              </p>
            </div>

            <Link
              href="/localities"
              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition"
            >
              <span>View all 20 localities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topLocalities.map((loc) => (
              <Link
                key={loc.slug}
                href={`/mumbai/${loc.slug}`}
                className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-600 transition">
                      {loc.name}
                    </h3>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {loc.zone}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">Avg Rent: {loc.rent}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700 group-hover:text-purple-600">
                  <span>Browse Homes</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROPERTY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
            Category Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Rent What Fits Your Lifestyle
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Whether you need a full family flat, a private room, or a budget-friendly PG.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/mumbai?type=flat"
            className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 hover:shadow-md transition text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-purple-600">
              Full Apartments
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">1, 2 & 3 BHK Flats</p>
          </Link>

          <Link
            href="/mumbai?type=room"
            className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 hover:shadow-md transition text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-purple-600">
              Private Rooms
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">In shared apartments</p>
          </Link>

          <Link
            href="/pg/mumbai"
            className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 hover:shadow-md transition text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-purple-600">
              PG & Co-Living
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Meals & housekeeping</p>
          </Link>

          <Link
            href="/flatmates/mumbai"
            className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 hover:shadow-md transition text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-purple-600">
              Flatmates
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">Verified roommates</p>
          </Link>
        </div>
      </section>

      {/* 6. FLATMATES SECTION */}
      {flatmates.length > 0 && (
        <section className="bg-white border-y border-stone-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                  Verified Roommates
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  Find Compatible Flatmates in Mumbai
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Connect with corporate professionals and students seeking room sharing.
                </p>
              </div>

              <Link
                href="/flatmates/mumbai"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800 transition"
              >
                <span>View all roommate profiles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flatmates.slice(0, 3).map((flatmate) => (
                <FlatmateCard key={flatmate.id} flatmate={flatmate} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. WHY REHVO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
            The REHVO Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Renting Without Middlemen
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Built for modern tenants and property owners who value transparency, security, and time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Zero Broker Commission</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Traditional brokers in Mumbai take 1 to 2 months of rent as commission. On REHVO, you connect directly with verified homeowners and save ₹35,000 to ₹90,000.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Verified Direct Listings</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every property listing undergoes verification to ensure genuine photographs, accurate amenities, realistic security deposit terms, and authentic host identity.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Confirmed Physical Visits</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No endless phone calls or ghosting. Select an available timeslot, schedule your on-site visit, and receive confirmed directions directly in the app.
            </p>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              How REHVO Works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              From discovering your ideal neighbourhood to moving in without broker fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900">Search & Filter</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Filter verified Mumbai flats, private rooms, and PGs by locality, BHK configuration, and budget brackets.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900">Chat & Schedule Visit</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Chat directly with the verified homeowner and book a physical site tour at a convenient timeslot.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900">Move In Zero Brokerage</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Agree on rental terms directly with the host and move into your new home without paying any middleman fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. APP DOWNLOAD CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AppDownloadBanner />
      </div>
    </>
  );
}
