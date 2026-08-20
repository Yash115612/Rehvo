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
  Heart,
  ChevronRight,
  Wallet,
  Clock,
  Eye,
  SlidersHorizontal,
  Compass,
  ArrowUpRight,
  Shield,
  Layers,
  KeyRound,
  Sparkle,
} from 'lucide-react';
import { getPublishedProperties, getPublishedFlatmates } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { HeroSearch } from '@/components/public/HeroSearch';
import { PropertyShowcase } from '@/components/public/PropertyShowcase';
import { MUMBAI_LOCALITIES, generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';
import { PublicFooter } from '@/components/public/PublicFooter';

export const revalidate = 60; // 60s ISR

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

  const topLocalities = [
    {
      slug: 'andheri-west',
      name: 'Andheri West',
      zone: 'Western Suburbs',
      rent: '₹35,000 - ₹85,000',
      description: 'Prime media & commercial powerhouse with direct Metro Lines 1, 2A & 7 connectivity.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    },
    {
      slug: 'bandra-west',
      name: 'Bandra West',
      zone: 'Western Suburbs',
      rent: '₹55,000 - ₹1,40,000',
      description: 'The cultural capital of Mumbai with sea promenades, heritage lanes & cafes.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'powai',
      name: 'Powai',
      zone: 'Central Suburbs',
      rent: '₹32,000 - ₹82,000',
      description: 'Lakeside modern high-rises, IT campuses, IIT Bombay, and planned townships.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'goregaon-west',
      name: 'Goregaon West',
      zone: 'Western Suburbs',
      rent: '₹26,000 - ₹65,000',
      description: 'Modern residential complexes close to Mindspace IT Park and Link Road hubs.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'thane-west',
      name: 'Thane',
      zone: 'Thane District',
      rent: '₹18,000 - ₹45,000',
      description: 'Expansive gated townships with lakes, malls, and spacious modern layouts.',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const categories = [
    {
      id: 'flats',
      name: 'Flats & Apartments',
      descriptor: '1, 2, 3 BHK homes for families & working professionals',
      href: '/mumbai',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
      tag: 'Full Homes',
    },
    {
      id: 'rooms',
      name: 'Private Single Rooms',
      descriptor: 'Furnished private rooms in premium shared apartments',
      href: '/rooms/mumbai',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
      tag: 'Private Room',
    },
    {
      id: 'pg',
      name: 'PG & Co-Living',
      descriptor: 'Managed residences with Wi-Fi, laundry, and meals included',
      href: '/pg/mumbai',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
      tag: 'All-Inclusive',
    },
    {
      id: 'studios',
      name: 'Studio Apartments',
      descriptor: 'Self-contained 1 RK & compact studios in transit corridors',
      href: '/studios/mumbai',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
      tag: '1 RK / Studio',
    },
    {
      id: 'flatmates',
      name: 'Flatmate Discovery',
      descriptor: 'Connect with roommates with aligned habits and room budgets',
      href: '/flatmates/mumbai',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
      tag: 'Social Match',
    },
  ];

  const primaryProperty = featuredProperties[0];
  const primaryFlatmate = flatmates[0] || null;
  const secondaryFlatmates = flatmates.slice(1, 4);

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema} />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — EDITORIAL REAL ESTATE COVER (40% Left / 60% Right) */}
      {/* ========================================================================= */}
      <section className="relative bg-[#121118] text-white pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden border-b border-stone-800/80">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/4 w-[650px] h-[650px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[550px] h-[550px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Asymmetrical 40/60 Cover Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-12 lg:mb-16">
            {/* Left Side (~40% on Desktop / 5 Cols) */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-7">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-purple-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Rent. Live. Belong.</span>
              </div>

              {/* Large Display Headline with Intentional Line Breaks */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Find a place <br />
                that feels like <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-200">
                  home.
                </span>
              </h1>

              {/* Short Supporting Copy */}
              <p className="text-base sm:text-lg text-stone-300 max-w-md leading-relaxed font-normal">
                Flats, rooms, PGs and flatmates — all in one trusted place.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/mumbai"
                  className="bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>Explore Homes</span>
                  <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/owner/properties/new"
                  className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-purple-400" />
                  <span>List Your Property</span>
                </Link>
              </div>

              {/* Trust Metric Checkmarks */}
              <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-bold text-stone-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Zero Brokerage</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct Owner Chat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Physical Visits</span>
                </div>
              </div>
            </div>

            {/* Right Side (~60% on Desktop / 7 Cols) — Dominant Architectural Photography */}
            <div className="lg:col-span-7 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Main Hero Photograph Frame */}
                <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-[36px] overflow-hidden border-2 border-white/15 shadow-2xl shadow-purple-950/40 bg-stone-900">
                  <Image
                    src={getSafeImageUrl(primaryProperty?.property_images?.[0]?.image_url, 0)}
                    alt={primaryProperty?.title || 'Modern luxury apartment in Mumbai'}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover scale-[1.02] hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

                  {/* Caption on Image */}
                  <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 block">
                        {primaryProperty?.locality || 'Bandra West'} • Mumbai
                      </span>
                      <h3 className="font-extrabold text-xl sm:text-2xl text-white leading-tight mt-0.5">
                        {primaryProperty?.title || '3 BHK Penthouse Suite'}
                      </h3>
                      <p className="text-xs text-stone-300 font-semibold mt-1">
                        ₹{(primaryProperty?.price || 120000).toLocaleString('en-IN')}/mo • 0% Brokerage
                      </p>
                    </div>

                    <Link
                      href={primaryProperty ? `/property/${generatePropertySlug(primaryProperty)}` : '/mumbai'}
                      className="hidden sm:inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      <span>View Home</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Floating Badge: Guaranteed Zero Commission Beacon */}
                <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 border border-stone-200 shadow-2xl text-stone-900 hidden sm:flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                      Guaranteed Zero Fee
                    </span>
                    <span className="text-xs font-extrabold text-stone-900">
                      Saved ₹45,000 - ₹90,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Search Dock Overlapping Lower Hero */}
          <div className="pt-2">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST STRIP — COMPACT HORIZONTAL BAR WITH THIN DIVIDERS */}
      {/* ========================================================================= */}
      <section className="bg-white py-8 border-b border-stone-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
            <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-4 first:pl-0">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-extrabold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Verified Listings</h4>
                <p className="text-[11px] text-stone-500 font-medium">100% genuine homeowners</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-extrabold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Direct Conversations</h4>
                <p className="text-[11px] text-stone-500 font-medium">Live in-app chat with hosts</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-6">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-extrabold">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Easy Scheduling</h4>
                <p className="text-[11px] text-stone-500 font-medium">Pick walkthrough time slots</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Secure & Trusted</h4>
                <p className="text-[11px] text-stone-500 font-medium">Zero broker commissions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR LOCATIONS — EDITORIAL 1 LARGE + 4 SMALLER LOCALITIES */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                  Explore
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
                Explore Mumbai by neighbourhood
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
                Find homes where you actually want to live with transparent rent benchmarks and verified transit connectivity.
              </p>
            </div>

            <Link
              href="/localities"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
            >
              <span>View all locations</span>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Locations Asymmetric Editorial Layout: 1 Large Locality + 4 Smaller Tiles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* ONE LARGE FEATURED LOCALITY (Andheri West - Left 6 Cols) */}
            <Link
              href={`/mumbai/${topLocalities[0].slug}`}
              className="lg:col-span-6 group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200/90"
            >
              <Image
                src={topLocalities[0].image}
                alt={topLocalities[0].name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-2 text-white">
                <span className="bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md inline-block shadow-sm">
                  {topLocalities[0].zone}
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {topLocalities[0].name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-md leading-relaxed">
                  {topLocalities[0].description}
                </p>

                <div className="pt-3 flex items-center justify-between border-t border-white/20 text-xs font-bold">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Avg Rent Range</span>
                    <span className="text-white text-sm">{topLocalities[0].rent}</span>
                  </div>
                  <span className="text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-extrabold">
                    <span>Explore Andheri</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* FOUR SMALLER LOCALITIES (Right 6 Cols Grid) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {topLocalities.slice(1, 5).map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/mumbai/${loc.slug}`}
                  className="group relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[220px] flex flex-col justify-end p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/90"
                >
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent pointer-events-none" />

                  <div className="relative z-10 space-y-0.5 text-white">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-300">
                      {loc.zone}
                    </span>
                    <h4 className="text-lg font-extrabold text-white leading-tight">
                      {loc.name}
                    </h4>
                    <p className="text-[11px] text-stone-300 font-semibold">
                      {loc.rent}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED PROPERTY SHOWCASE (Magazine 1 Large + 2 Stacked + 1 Wide) */}
      {/* ========================================================================= */}
      <PropertyShowcase properties={featuredProperties} totalCount={totalCount} />

      {/* ========================================================================= */}
      {/* 5. BROWSE BY PROPERTY TYPE — LARGE VISUAL CATEGORY PANELS */}
      {/* ========================================================================= */}
      <section className="bg-white py-20 sm:py-28 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                  Categories
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
                Spaces crafted for every lifestyle
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
                Select the exact rental format that matches your routine, work setup, and budget.
              </p>
            </div>

            <Link
              href="/mumbai"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
            >
              <span>Explore all formats</span>
              <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 5 Category Image Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat.id}
                href={cat.href}
                className={`group relative rounded-3xl overflow-hidden min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:border-purple-300 transition-all duration-300 border border-stone-200/90 ${
                  idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1'
                }`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-1.5 text-white">
                  <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full inline-block">
                    {cat.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight group-hover:text-purple-300 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-300 line-clamp-2 max-w-sm">
                    {cat.descriptor}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-xs font-extrabold text-purple-300 group-hover:translate-x-1 transition-transform">
                    <span>Browse Collection</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FLATMATE SECTION — SOCIAL STYLE (1 Large Portrait + 3 Profile Cards) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600" />
                <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                  Roommates
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
                Find your flatmate.
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
                Connect directly with verified working professionals and students with aligned routines and room budgets.
              </p>
            </div>

            <Link
              href="/flatmates/mumbai"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
            >
              <span>Find Your Flatmate →</span>
            </Link>
          </div>

          {/* Social Roommates Editorial Composition: 1 Large Card + 3 Smaller Profile Cards */}
          {flatmates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Primary Large Flatmate Card (Left 5 Cols) */}
              {primaryFlatmate && (
                <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between space-y-6">
                  <div className="space-y-5">
                    <div className="flex items-center gap-4">
                      {primaryFlatmate.photo ? (
                        <Image
                          src={primaryFlatmate.photo}
                          alt={primaryFlatmate.name}
                          width={72}
                          height={72}
                          className="w-18 h-18 rounded-2xl object-cover border border-stone-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-18 h-18 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-3xl">
                          {primaryFlatmate.profession?.charAt(0) || 'R'}
                        </div>
                      )}

                      <div>
                        <span className="bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full inline-block mb-1">
                          Featured Flatmate
                        </span>
                        <h4 className="text-xl font-extrabold text-stone-900 leading-tight">
                          {primaryFlatmate.name}
                          {primaryFlatmate.age ? `, ${primaryFlatmate.age}` : ''}
                        </h4>
                        <p className="text-xs font-semibold text-stone-500">{primaryFlatmate.profession}</p>
                        <span className="text-xs font-extrabold text-purple-700 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {primaryFlatmate.locality}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {primaryFlatmate.bio ||
                        'Looking for a clean, peaceful shared apartment with reliable Wi-Fi and respectful working professionals.'}
                    </p>

                    {primaryFlatmate.lifestyle_preferences && primaryFlatmate.lifestyle_preferences.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {primaryFlatmate.lifestyle_preferences.map((tag) => (
                          <span
                            key={tag}
                            className="bg-stone-100 border border-stone-200/80 text-stone-700 text-[11px] font-bold px-3 py-1 rounded-xl"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase block">Max Budget</span>
                      <span className="text-sm font-extrabold text-stone-900">
                        ₹{primaryFlatmate.budget_max?.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    <Link
                      href={`/flatmates/${primaryFlatmate.id}`}
                      className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
                    >
                      Connect →
                    </Link>
                  </div>
                </div>
              )}

              {/* 3 Secondary Flatmate Profile Cards (Right 7 Cols) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {secondaryFlatmates.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {f.photo ? (
                          <Image
                            src={f.photo}
                            alt={f.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-lg">
                            {f.profession?.charAt(0) || 'R'}
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-extrabold text-stone-900 leading-tight">
                            {f.name}
                            {f.age ? `, ${f.age}` : ''}
                          </h4>
                          <span className="text-[10px] font-extrabold text-purple-700 flex items-center gap-0.5 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {f.locality}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-500 font-medium line-clamp-2">
                        {f.profession || 'Working Professional'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-stone-900">
                        ₹{f.budget_max?.toLocaleString('en-IN')}/mo
                      </span>

                      <Link
                        href={`/flatmates/${f.id}`}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-900 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 space-y-3 shadow-sm">
              <Users className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-900">Flatmate profiles being verified</h3>
              <Link
                href="/flatmates/create"
                className="inline-block bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                Create First Profile
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHY REHVO — TYPOGRAPHY-DRIVEN STATEMENT SECTION (Midnight #121118) */}
      {/* ========================================================================= */}
      <section className="bg-[#121118] text-white py-24 sm:py-32 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Side: Statement Display Typography */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest block">
                The Standard
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
                Find better. <br />
                Connect directly. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                  Move confidently.
                </span>
              </h2>
              <p className="text-sm text-stone-400 max-w-sm pt-2 leading-relaxed">
                REHVO is engineered to remove predatory broker commissions and bring transparent rental living to Mumbai.
              </p>
            </div>

            {/* Right Side: Editorial Rows with Thin Hairline Separators */}
            <div className="lg:col-span-7 space-y-8 divide-y divide-white/10">
              <div className="pt-6 first:pt-0 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-purple-400">01</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Verified & Genuine</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                  Every property and flatmate profile is physically checked and verified to eliminate fake listings, ghost owners, and duplicate brokers.
                </p>
              </div>

              <div className="pt-6 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-purple-400">02</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Direct Conversations</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                  Live real-time messaging directly between homeowners and tenants with zero broker interference or phone number leakage.
                </p>
              </div>

              <div className="pt-6 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-purple-400">03</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Easy Scheduling</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                  Pick your preferred on-site visit date and time slot. Hosts confirm walkthroughs instantly without back-and-forth phone calls.
                </p>
              </div>

              <div className="pt-6 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-purple-400">04</span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">Secure & Trusted</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                  100% zero brokerage policy. Keep your hard-earned 1-2 months’ deposit savings entirely in your own pocket.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HOW IT WORKS — VISUAL HORIZONTAL STORY (01, 02, 03) */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Journey
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Simple from search to move-in
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Three seamless steps designed to save you weeks of broker calls and wasted visits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <span className="text-5xl font-extrabold text-purple-600/30 font-mono block">01</span>
              <h3 className="text-xl font-extrabold text-stone-900">Discover & Filter</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Browse verified properties, single rooms, or roommates filtered by locality, budget brackets, and furnishing state.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-5xl font-extrabold text-purple-600/30 font-mono block">02</span>
              <h3 className="text-xl font-extrabold text-stone-900">Connect & Schedule</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Start a live chat thread with the owner and book a physical on-site visit slot that fits your personal schedule.
              </p>
            </div>

            <div className="space-y-4">
              <span className="text-5xl font-extrabold text-purple-600/30 font-mono block">03</span>
              <h3 className="text-xl font-extrabold text-stone-900">Visit & Move In</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Agree on rental terms directly with the host. No hidden commissions, zero broker interference, and complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. LIST YOUR PROPERTY — PREMIUM SPLIT SECTION (#171522) */}
      {/* ========================================================================= */}
      <section className="bg-white py-20 sm:py-28 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#171522] rounded-3xl sm:rounded-[40px] overflow-hidden text-white grid grid-cols-1 lg:grid-cols-12 shadow-2xl border border-stone-800">
            {/* Left Image Column */}
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[320px]">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80"
                alt="Modern exterior and living room for rent in Mumbai"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#171522]/90 hidden lg:block" />
            </div>

            {/* Right Copy Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider w-fit">
                For Property Owners
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Have a place to rent? <br />
                <span className="text-purple-400">List it on REHVO.</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-md">
                Reach verified tenants looking for homes across Mumbai. Zero listing fees, direct renter inquiries, and intuitive on-site visit scheduling.
              </p>

              <div className="pt-2">
                <Link
                  href="/owner/properties/new"
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List Your Property</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. REHVO APP SHOWCASE — PRODUCT SHOWCASE */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Mobile Experience
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Take REHVO wherever you go.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Search, chat, schedule visits, and manage your place from anywhere on iOS and Android.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200/80 px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>iOS App • Coming Soon</span>
                </span>
                <span className="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200/80 px-4 py-2.5 rounded-xl flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Android App • Coming Soon</span>
                </span>
              </div>
            </div>

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Smartphone className="w-12 h-12" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FINAL CLOSING CTA — MIDNIGHT BRAND SURFACE (#0E0D14) */}
      {/* ========================================================================= */}
      <section className="bg-[#0E0D14] text-white py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Your next place <br />
            could be closer <br />
            than you think.
          </h2>

          <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto">
            Join thousands of renters and verified homeowners discovering modern zero-brokerage living in Mumbai.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/mumbai"
              className="bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl transition"
            >
              Explore Homes
            </Link>

            <Link
              href="/owner/properties/new"
              className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* 12. REFINED FOOTER */}
      <PublicFooter />
    </>
  );
}
