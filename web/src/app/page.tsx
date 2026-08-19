import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
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
  Check,
  PlusCircle,
  Smartphone,
} from 'lucide-react';
import { getPublishedProperties, getPublishedFlatmates } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { PropertyCard } from '@/components/public/PropertyCard';
import { FlatmateCard } from '@/components/public/FlatmateCard';
import { HeroSearch } from '@/components/public/HeroSearch';
import { MUMBAI_LOCALITIES, generatePropertySlug } from '@/lib/seo/slugs';

export const revalidate = 60; // 60s ISR

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO — Zero-Brokerage Verified Rentals & Flatmates in Mumbai',
  description:
    'Find verified 1, 2, 3 BHK apartments, single rooms, PGs and flatmates across Mumbai with zero brokerage. Direct owner chat, confirmed physical visits, and transparent pricing.',
  canonicalUrl: 'https://rehvo.com',
});

export default async function HomePage() {
  const [{ properties: featuredProperties, totalCount }, flatmates] = await Promise.all([
    getPublishedProperties({ city: 'Mumbai', limit: 6 }),
    getPublishedFlatmates('Mumbai'),
  ]);

  const orgSchema = generateOrganizationSchema();
  const itemListSchema = generateItemListSchema(
    featuredProperties,
    'Featured Zero-Brokerage Properties in Mumbai'
  );

  const topLocalities = [
    {
      slug: 'andheri-west',
      name: 'Andheri West',
      zone: 'Western Suburbs',
      rent: '₹35,000 - ₹85,000',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'bandra-west',
      name: 'Bandra West',
      zone: 'Western Suburbs',
      rent: '₹50,000 - ₹1,40,000',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'powai',
      name: 'Powai',
      zone: 'Central Suburbs',
      rent: '₹32,000 - ₹82,000',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'juhu',
      name: 'Juhu',
      zone: 'Western Suburbs',
      rent: '₹45,000 - ₹1,20,000',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'goregaon-west',
      name: 'Goregaon West',
      zone: 'Western Suburbs',
      rent: '₹26,000 - ₹65,000',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'worli',
      name: 'Worli',
      zone: 'South Mumbai',
      rent: '₹55,000 - ₹1,60,000',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'malad-west',
      name: 'Malad West',
      zone: 'Western Suburbs',
      rent: '₹24,000 - ₹60,000',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'thane-west',
      name: 'Thane West',
      zone: 'Thane',
      rent: '₹16,000 - ₹40,000',
      image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema} />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900 text-white pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Subtle Ambient Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-purple-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Zero-Brokerage Verified Platform
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Find a place that feels like <span className="text-purple-400">home.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Real homes, rooms, PGs and flatmates in Mumbai — 100% zero brokerage directly from verified owners.
            </p>
          </div>

          {/* Primary Search Module */}
          <HeroSearch />

          {/* Subtle Trust Line */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verified Listings</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct Owner Inquiries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Scheduled On-Site Visits</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR LOCATIONS ("Explore Mumbai by neighbourhood") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
              Neighbourhood Discovery
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Explore Mumbai by neighbourhood
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Direct rental benchmarks and verified properties across high-demand residential hubs.
            </p>
          </div>

          <Link
            href="/localities"
            className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-purple-600 transition"
          >
            <span>View all 20 localities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topLocalities.map((loc) => (
            <Link
              key={loc.slug}
              href={`/mumbai/${loc.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                <Image
                  src={loc.image}
                  alt={`Flats for rent in ${loc.name}, Mumbai`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
                    {loc.zone}
                  </span>
                  <h3 className="font-extrabold text-lg text-white leading-tight">
                    {loc.name}
                  </h3>
                </div>
              </div>

              <div className="p-4 sm:p-5 flex items-center justify-between text-xs border-t border-stone-100">
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 block">Avg 2 BHK Rent</span>
                  <span className="font-extrabold text-stone-800">{loc.rent}</span>
                </div>
                <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HOMES ("Places worth seeing") */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                Curated Collection
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Places worth seeing
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Verified zero-brokerage apartments and rooms directly from homeowners.
              </p>
            </div>

            <Link
              href="/mumbai"
              className="inline-flex items-center gap-1 text-xs font-bold text-stone-900 hover:text-purple-600 transition"
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
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto">
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
        </div>
      </section>

      {/* 4. PROPERTY TYPES ("Rent What Fits Your Life") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
            Category Discovery
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Rent what fits your lifestyle
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Whether you need a full family apartment, a single private room, or a budget-friendly PG.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Link
            href="/mumbai?type=flat"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-center group flex flex-col justify-between"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-600 transition">
                Full Apartments
              </h3>
              <p className="text-xs text-stone-500 mt-1">1, 2 & 3 BHK Flats</p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-bold text-purple-600">
              Browse Flats →
            </div>
          </Link>

          <Link
            href="/mumbai?type=room"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-center group flex flex-col justify-between"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Home className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-600 transition">
                Private Rooms
              </h3>
              <p className="text-xs text-stone-500 mt-1">In shared apartments</p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-bold text-emerald-600">
              Browse Rooms →
            </div>
          </Link>

          <Link
            href="/pg/mumbai"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-center group flex flex-col justify-between"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-600 transition">
                PG & Co-Living
              </h3>
              <p className="text-xs text-stone-500 mt-1">Meals & housekeeping</p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-bold text-blue-600">
              Browse PG →
            </div>
          </Link>

          <Link
            href="/flatmates/mumbai"
            className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 text-center group flex flex-col justify-between"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 group-hover:text-purple-600 transition">
                Flatmates
              </h3>
              <p className="text-xs text-stone-500 mt-1">Verified roommates</p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-bold text-amber-600">
              Find Flatmates →
            </div>
          </Link>
        </div>
      </section>

      {/* 5. FLATMATES ("Find your flatmate") */}
      {flatmates.length > 0 && (
        <section className="bg-white border-y border-stone-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                  Verified Roommates
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Find your flatmate in Mumbai
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Connect with corporate professionals and students seeking room sharing in Mumbai.
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

      {/* 6. WHY REHVO ("Renting Without Middlemen") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
            The REHVO Difference
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Renting without middlemen
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Built for modern tenants and property owners who value transparency, security, and time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">100% Zero Brokerage</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Traditional brokers in Mumbai take 1 to 2 months of rent as commission. On REHVO, you connect directly with verified homeowners and save ₹35,000 to ₹90,000 on every lease.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Verified Direct Listings</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every property listing undergoes verification to ensure genuine photographs, accurate amenities, realistic security deposit terms, and authentic host identity.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
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

      {/* 7. HOW IT WORKS (3-Step Storytelling) */}
      <section className="bg-stone-100/70 border-y border-stone-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              How REHVO works
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              From discovering your ideal neighbourhood to moving in without broker fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
              <span className="text-3xl font-extrabold text-stone-300 block">01</span>
              <h3 className="text-lg font-bold text-stone-900">Discover</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Filter verified Mumbai flats, private rooms, and PGs by locality, BHK configuration, and budget brackets with complete price transparency.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
              <span className="text-3xl font-extrabold text-stone-300 block">02</span>
              <h3 className="text-lg font-bold text-stone-900">Connect</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Chat directly with the verified homeowner and book a physical site visit at a confirmed timeslot without middleman delays.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
              <span className="text-3xl font-extrabold text-stone-300 block">03</span>
              <h3 className="text-lg font-bold text-stone-900">Move In</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Agree on rental terms directly with the host and move into your new home without paying a single rupee of broker commission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOST / LIST PROPERTY CTA ("Have a place to rent?") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-purple-950 rounded-3xl p-8 sm:p-14 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              For Property Owners
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Have a place to rent in Mumbai?
            </h2>
            <p className="text-sm sm:text-base text-stone-300 max-w-xl leading-relaxed">
              List your flat or room on REHVO in 3 minutes. Connect directly with verified tenants, set your own terms, and manage scheduled property visits with zero broker hassle.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/list-property"
              className="bg-white hover:bg-stone-100 text-stone-900 font-extrabold text-xs sm:text-sm py-4 px-6 rounded-2xl transition text-center shadow-md flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>List Your Property (Free)</span>
            </Link>
            <Link
              href="/about"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-4 px-6 rounded-2xl transition text-center backdrop-blur-md"
            >
              How Host Verification Works
            </Link>
          </div>
        </div>
      </section>

      {/* 9. APP CTA SHOWCASE ("REHVO, wherever you are.") */}
      <section className="bg-white border-y border-stone-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple-50 rounded-3xl p-8 sm:p-14 border border-purple-100 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                Mobile Experience
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                REHVO, wherever you are.
              </h2>
              <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
                Receive instant notifications when hosts accept your visit requests, chat in real-time, and access directions on your phone.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="https://play.google.com/store/apps"
                  className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <span>Google Play (Android)</span>
                </Link>
                <Link
                  href="https://apps.apple.com"
                  className="bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 text-xs font-bold px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <span>App Store (iOS)</span>
                </Link>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="w-48 h-48 rounded-3xl bg-white p-4 shadow-xl border border-purple-100 flex flex-col items-center justify-center text-center space-y-2">
                <Smartphone className="w-12 h-12 text-purple-600" />
                <span className="text-xs font-extrabold text-stone-900">REHVO Mobile</span>
                <span className="text-[10px] text-stone-500">Scan or search on App Store</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA ("Your next place might already be here.") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            Your next place might already be here.
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Browse verified flats and rooms across Mumbai, or post your vacant property for thousands of verified renters.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/mumbai"
              className="bg-stone-900 hover:bg-black text-white font-extrabold text-sm py-4 px-8 rounded-full shadow-lg transition flex items-center gap-2"
            >
              <span>Explore Mumbai Homes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/list-property"
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-sm py-4 px-8 rounded-full border border-purple-200 transition"
            >
              List a Property (Free)
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
