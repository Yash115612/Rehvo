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
} from 'lucide-react';
import { getPublishedProperties, getPublishedFlatmates } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateOrganizationSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { HeroSearch } from '@/components/public/HeroSearch';
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
      slug: 'bandra-west',
      name: 'Bandra West',
      zone: 'Western Suburbs',
      rent: '₹55,000 - ₹1,40,000',
      description: 'The cultural and lifestyle capital of Mumbai with sea promenades & cafes.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
    },
    {
      slug: 'andheri-west',
      name: 'Andheri West',
      zone: 'Western Suburbs',
      rent: '₹35,000 - ₹85,000',
      description: 'Prime media & corporate hub with direct Metro Lines 1, 2A & 7 connectivity.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'powai',
      name: 'Powai',
      zone: 'Central Suburbs',
      rent: '₹32,000 - ₹82,000',
      description: 'Serene lakeside living, tech campuses, IIT Bombay, and planned townships.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'worli',
      name: 'Worli',
      zone: 'South Mumbai',
      rent: '₹60,000 - ₹1,60,000',
      description: 'Iconic sea link panoramas, luxury high-rises, and central business access.',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'juhu',
      name: 'Juhu',
      zone: 'Western Suburbs',
      rent: '₹45,000 - ₹1,20,000',
      description: 'Prestigious beachside enclave with peaceful residential lanes and dining.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'goregaon-west',
      name: 'Goregaon West',
      zone: 'Western Suburbs',
      rent: '₹26,000 - ₹65,000',
      description: 'Modern residential complexes close to Mindspace IT Park and Link Road.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const primaryProperty = featuredProperties[0];
  const secondaryProperties = featuredProperties.slice(1, 3);
  const remainingProperties = featuredProperties.slice(3, 6);

  return (
    <>
      <JsonLd data={orgSchema} />
      <JsonLd data={itemListSchema} />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION — ART DIRECTED EDITORIAL ASYMMETRICAL LAYOUT */}
      {/* ========================================================================= */}
      <section className="relative bg-[#121118] text-white pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden border-b border-stone-800/80">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-indigo-900/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Asymmetrical Split: Text/Actions Left vs Visual Composition Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-12 lg:mb-16">
            {/* Left Column: Display Typography & Brand Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-purple-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>100% Zero-Brokerage Verified Platform</span>
              </div>

              {/* Massive Display Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06]">
                Find a place <br />
                that feels like <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-200">
                  home.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed font-normal">
                Discover verified apartments, private single rooms, and compatible flatmates across Mumbai. Zero brokerage directly from verified property owners.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/mumbai"
                  className="bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 group"
                >
                  <span>Explore Mumbai Homes</span>
                  <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/owner/properties/new"
                  className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-purple-400" />
                  <span>List Your Property (Free)</span>
                </Link>
              </div>

              {/* Trust Metric Checkmarks */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-bold text-stone-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Zero Commission</span>
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

            {/* Right Column: Editorial Multi-Image Composition with Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photograph Frame */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl shadow-purple-950/40 bg-stone-900">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80"
                    alt="Luxury modern apartment in Mumbai"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover scale-[1.02] hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

                  {/* Caption on Image */}
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
                      Bandra West • Sea View
                    </span>
                    <h3 className="font-extrabold text-lg sm:text-xl text-white leading-tight mt-0.5">
                      3 BHK Penthouse Suite
                    </h3>
                    <p className="text-xs text-stone-300 font-semibold mt-1">
                      ₹1,20,000/mo • Verified Owner • 0% Brokerage
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1: Brokerage Savings Badge */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 border border-stone-200 shadow-2xl text-stone-900 hidden sm:flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
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

                {/* Floating Badge 2: On-Site Visit Confirmation Beacon */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 border border-stone-200 shadow-2xl text-stone-900 hidden sm:flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block">
                      Physical Tour Booked
                    </span>
                    <span className="text-xs font-extrabold text-stone-900">
                      Tomorrow at 11:30 AM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Physical Search Console (Overlapping lower hero) */}
          <div className="pt-2">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 01 — FEATURED SHOWCASE ("Places worth seeing") */}
      {/* ========================================================================= */}
      <section className="bg-[#F8F7F4] py-20 sm:py-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Editorial Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                01 — Curated Collection
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
                Places worth seeing
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg">
                Handpicked zero-brokerage apartments and furnished rooms verified directly with property owners.
              </p>
            </div>

            <Link
              href="/mumbai"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-900 hover:text-purple-600 transition"
            >
              <span>View all {totalCount} verified homes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="space-y-6">
              {/* Asymmetrical Top Layout: 1 Hero Wide Feature Card + 2 Stacked Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Large Panoramic Hero Property Card */}
                {primaryProperty && (
                  <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group">
                    <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                      <Image
                        src={getSafeImageUrl(primaryProperty.property_images?.[0]?.image_url, 0)}
                        alt={primaryProperty.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="bg-stone-900/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                          Featured Home
                        </span>
                        <span className="bg-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                          0% Brokerage
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                            {primaryProperty.locality}, {primaryProperty.city}
                          </span>
                          <span className="text-xl sm:text-2xl font-extrabold text-stone-900">
                            ₹{primaryProperty.price.toLocaleString('en-IN')}
                            <span className="text-xs font-normal text-stone-400">/mo</span>
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1 leading-tight group-hover:text-purple-700 transition">
                          {primaryProperty.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                          {primaryProperty.description ||
                            'Spacious well-ventilated property with natural light, prime transit connectivity, and modern society amenities.'}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                        <div className="flex items-center gap-3">
                          <span>{primaryProperty.bedrooms} BHK</span>
                          <span>•</span>
                          <span>{primaryProperty.bathrooms} Baths</span>
                          <span>•</span>
                          <span>{primaryProperty.area} sq.ft</span>
                        </div>

                        <Link
                          href={`/property/${generatePropertySlug(primaryProperty)}`}
                          className="text-purple-600 hover:text-purple-800 flex items-center gap-1 font-extrabold"
                        >
                          <span>Explore Place</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2 Stacked Vertical Property Cards */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {secondaryProperties.map((prop, idx) => (
                    <Link
                      key={prop.id}
                      href={`/property/${generatePropertySlug(prop)}`}
                      className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row flex-1 group"
                    >
                      <div className="relative aspect-[16/10] sm:aspect-square sm:w-48 bg-stone-100 flex-shrink-0 overflow-hidden">
                        <Image
                          src={getSafeImageUrl(prop.property_images?.[0]?.image_url, idx + 1)}
                          alt={prop.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 200px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-stone-900/90 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                          {prop.bedrooms} BHK
                        </span>
                      </div>

                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider block">
                            {prop.locality}
                          </span>
                          <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-purple-700 transition leading-tight mt-0.5 line-clamp-1">
                            {prop.title}
                          </h4>
                          <p className="text-base font-extrabold text-stone-900 mt-1">
                            ₹{prop.price.toLocaleString('en-IN')}
                            <span className="text-[11px] font-normal text-stone-400">/mo</span>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                          <span>{prop.furnishing.replace('_', ' ')}</span>
                          <span className="text-purple-600 font-bold group-hover:translate-x-0.5 transition-transform">
                            View →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom Row of 3 Additional Grid Properties */}
              {remainingProperties.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                  {remainingProperties.map((prop, idx) => (
                    <Link
                      key={prop.id}
                      href={`/property/${generatePropertySlug(prop)}`}
                      className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                        <Image
                          src={getSafeImageUrl(prop.property_images?.[0]?.image_url, idx + 3)}
                          alt={prop.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                          {prop.bedrooms} BHK • {prop.type}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">
                              {prop.locality}
                            </span>
                            <span className="text-base font-extrabold text-stone-900">
                              ₹{prop.price.toLocaleString('en-IN')}
                              <span className="text-[10px] font-normal text-stone-400">/mo</span>
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-purple-700 transition leading-tight mt-1 line-clamp-1">
                            {prop.title}
                          </h4>
                        </div>

                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                          <span>{prop.area} sq.ft</span>
                          <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform">
                            Details →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-stone-200 space-y-3">
              <Building className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">New verified homes coming online</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Explore all rental listings or list your property directly on REHVO.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 02 — LOCATIONS ("Mumbai, mapped for living") */}
      {/* ========================================================================= */}
      <section className="bg-white py-20 sm:py-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                02 — Neighbourhoods
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
                Mumbai, mapped for living
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg">
                Explore residential pockets with transparent rent benchmarks and verified transit connectivity.
              </p>
            </div>

            <Link
              href="/localities"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-900 hover:text-purple-600 transition"
            >
              <span>View all 20 localities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Locations Editorial Layout: 1 Hero Locality + 4 Secondary Locality Tiles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Featured Hero Locality Tile (Bandra West) */}
            <Link
              href={`/mumbai/${topLocalities[0].slug}`}
              className="lg:col-span-6 group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
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
                <span className="bg-purple-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md inline-block">
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
                    <span className="text-[10px] text-stone-400 block uppercase">Avg 2 BHK Rent</span>
                    <span className="text-white text-sm">{topLocalities[0].rent}</span>
                  </div>
                  <span className="text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Bandra</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 4 Secondary Locality Grid Tiles */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {topLocalities.slice(1, 5).map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/mumbai/${loc.slug}`}
                  className="group relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[220px] flex flex-col justify-end p-5 shadow-sm hover:shadow-lg transition-all duration-300"
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
      {/* 4. SECTION 03 — PROPERTY TYPES ("Spaces crafted for every lifestyle") */}
      {/* ========================================================================= */}
      <section className="bg-stone-50 py-20 sm:py-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
              03 — Spaces
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Spaces crafted for every lifestyle
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Select the exact format that matches your routine, work setup, and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tile 1: Full Apartments */}
            <Link
              href="/mumbai"
              className="group bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-purple-700 transition">
                    Full Apartments
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Spacious 1, 2, 3 BHK residences for families & working professionals with zero brokerage.
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Flats</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Tile 2: Single Rooms */}
            <Link
              href="/rooms/mumbai"
              className="group bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-purple-700 transition">
                    Single Rooms
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Private furnished bedrooms in premium shared apartments with verified flatmates.
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Rooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Tile 3: PG & Hostels */}
            <Link
              href="/pg/mumbai"
              className="group bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-purple-700 transition">
                    PG & Co-Living
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Hostels and co-living residences with Wi-Fi, laundry & daily housekeeping.
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse PGs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            {/* Tile 4: Studio Flats */}
            <Link
              href="/studios/mumbai"
              className="group bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-purple-700 transition">
                    Studio Flats
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Self-contained 1 RK & compact studio units in prime residential transit nodes.
                  </p>
                </div>
              </div>

              <span className="text-xs font-extrabold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Browse Studios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 04 — FLATMATES ("Live with people you actually like") */}
      {/* ========================================================================= */}
      <section className="bg-white py-20 sm:py-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">
                04 — People
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
                Live with people you actually like
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg">
                Connect directly with working professionals and students with aligned routines and room budgets.
              </p>
            </div>

            <Link
              href="/flatmates/mumbai"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-stone-900 hover:text-purple-600 transition"
            >
              <span>Explore all flatmates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Social Roommates Layout */}
          {flatmates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flatmates.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  className="bg-stone-50 rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {f.photo ? (
                        <Image
                          src={f.photo}
                          alt={f.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-2xl">
                          {f.profession?.charAt(0) || 'R'}
                        </div>
                      )}

                      <div>
                        <h4 className="text-base font-extrabold text-stone-900 leading-tight">
                          {f.name}
                          {f.age ? `, ${f.age}` : ''}
                        </h4>
                        <p className="text-xs font-semibold text-stone-500">{f.profession}</p>
                        <span className="text-[11px] font-extrabold text-purple-700 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {f.locality}
                        </span>
                      </div>
                    </div>

                    {f.lifestyle_preferences && f.lifestyle_preferences.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {f.lifestyle_preferences.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-white border border-stone-200 text-stone-700 text-[10px] font-bold px-2.5 py-1 rounded-xl"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase block">Max Budget</span>
                      <span className="text-xs font-extrabold text-stone-900">
                        ₹{f.budget_max?.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    <Link
                      href={`/flatmates/${f.id}`}
                      className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      Connect →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-stone-50 rounded-3xl p-12 text-center border border-stone-200 space-y-3">
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
      {/* 6. SECTION 05 — WHY REHVO (Statement-Driven Brand Section) */}
      {/* ========================================================================= */}
      <section className="bg-[#121118] text-white py-24 sm:py-32 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Large Statement */}
          <div className="max-w-3xl mb-16 sm:mb-20 space-y-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest block">
              05 — The Standard
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Find better. <br />
              Connect directly. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                Move with confidence.
              </span>
            </h2>
          </div>

          {/* 3 Interconnected Visual Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-4">
              <span className="text-3xl font-extrabold text-purple-400 font-mono">01</span>
              <h3 className="text-xl font-extrabold text-white">100% Zero Brokerage</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Never pay 1-2 months’ rent in commission. Connect directly with real homeowners and roommates with zero middleman fees.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-4">
              <span className="text-3xl font-extrabold text-purple-400 font-mono">02</span>
              <h3 className="text-xl font-extrabold text-white">Direct Real-Time Chat</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Message verified property hosts and potential roommates directly in-app. Instant responses without sharing personal numbers publicly.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md space-y-4">
              <span className="text-3xl font-extrabold text-purple-400 font-mono">03</span>
              <h3 className="text-xl font-extrabold text-white">Scheduled On-Site Visits</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Pick your preferred date and time slot for a physical walkthrough. Verified hosts confirm your tour instantly in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. SECTION 06 — HOW IT WORKS ("Simple from search to move-in") */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
              06 — Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
              Simple from search to move-in
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Three seamless steps designed to save you weeks of broker calls and wasted visits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold text-lg">
                1
              </div>
              <h3 className="text-lg font-extrabold text-stone-900">01. Discover & Filter</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Browse verified properties, single rooms, or roommates filtered by locality, budget brackets, and furnishing state.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold text-lg">
                2
              </div>
              <h3 className="text-lg font-extrabold text-stone-900">02. Chat & Schedule Tour</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Start a live chat thread with the owner and book a physical on-site visit slot that fits your personal schedule.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold text-lg">
                3
              </div>
              <h3 className="text-lg font-extrabold text-stone-900">03. Move In Direct</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Agree on rental terms directly with the host. No hidden commissions, zero broker interference, and complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SECTION 07 — HOST / LIST PROPERTY SPLIT SECTION */}
      {/* ========================================================================= */}
      <section className="bg-white py-20 sm:py-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#171522] rounded-3xl sm:rounded-[40px] overflow-hidden text-white grid grid-cols-1 lg:grid-cols-12 shadow-2xl border border-stone-800">
            {/* Left Image Column */}
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[300px]">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80"
                alt="Modern living room for rent in Mumbai"
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
                  <span>List Your Property (Free)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. SECTION 08 — APP PROMOTION ("Take the search with you") */}
      {/* ========================================================================= */}
      <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-lg">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block">
                08 — On The Go
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Take the search with you.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Receive instant notifications when hosts confirm visits or reply to your chat inquiries on iOS and Android.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3.5 py-2 rounded-xl">
                  iOS App • Coming Soon
                </span>
                <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3.5 py-2 rounded-xl">
                  Android App • Coming Soon
                </span>
              </div>
            </div>

            <div className="w-24 h-24 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-inner">
              <Smartphone className="w-12 h-12" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. SECTION 09 — FINAL MEMORABLE CLOSING CTA */}
      {/* ========================================================================= */}
      <section className="bg-[#0E0D14] text-white py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Your next place <br />
            could be closer than you think.
          </h2>

          <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto">
            Join thousands of renters and verified homeowners discovering modern zero-brokerage living in Mumbai.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/mumbai"
              className="bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl transition"
            >
              Explore Mumbai Rentals
            </Link>

            <Link
              href="/owner/properties/new"
              className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition"
            >
              Start on REHVO
            </Link>
          </div>
        </div>
      </section>

      {/* 11. REFINED FOOTER */}
      <PublicFooter />
    </>
  );
}
