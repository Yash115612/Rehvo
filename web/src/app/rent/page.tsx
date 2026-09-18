import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { LOCALITIES_DATA } from '@/lib/seo/localityData';
import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { generateItemListSchema } from '@/lib/seo/schema';

export const revalidate = 3600;

export const metadata: Metadata = constructSeoMetadata({
  title: 'Flats & Apartments for Rent in Mumbai | 100% Verified Direct Owners',
  description:
    'Search 1, 2, 3 BHK verified rental flats in Mumbai without paying brokerage fees. Direct owner contact, physical walkthrough guarantee, and low security deposit rentals on REHVO.',
  canonicalUrl: 'https://rehvo.in/rent',
  keywords: [
    'flats for rent in mumbai',
    'apartments for rent',
    'zero brokerage mumbai',
    'direct owner rentals',
    '1 bhk for rent mumbai',
    '2 bhk for rent mumbai',
    '3 bhk for rent mumbai',
    'rehvo rent',
  ],
});

export default async function RentHubPage() {
  const { properties } = await getPublishedProperties({
    city: 'Mumbai',
    limit: 16,
  });

  const localities = Object.values(LOCALITIES_DATA);
  const breadcrumbs = [{ name: 'Rentals in Mumbai', url: '/rent' }];
  const itemListSchema = generateItemListSchema(
    'Flats for Rent in Mumbai',
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }))
  );

  const SEARCH_CURATED = [
    { title: '2 BHK Flats for Rent in Mumbai', href: '/rent/2-bhk-for-rent-in-mumbai', count: 'High Demand' },
    { title: '1 BHK Flats for Rent in Mumbai', href: '/rent/1-bhk-for-rent-in-mumbai', count: 'Best for Singles' },
    { title: '3 BHK Apartments in Bandra', href: '/rent/3-bhk-in-bandra', count: 'Luxury Living' },
    { title: 'Affordable Flats in Powai', href: '/rent/affordable-flats-in-powai', count: 'Tech Hub' },
    { title: 'Gated Societies in Andheri West', href: '/rent/gated-societies-in-andheri-west', count: 'Family Friendly' },
    { title: 'Sea-Facing Flats in Worli', href: '/rent/luxury-apartments-in-worli', count: 'Skyline Luxury' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Zero Brokerage • Direct Homeowners</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
            Flats & Apartments for Rent in Mumbai
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Browse verified residential flats and apartments for rent across Mumbai’s top neighborhoods. Every listing has its Index-II title deed verified with instant visit booking.
          </p>

          {/* Quick Search Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {SEARCH_CURATED.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#0E8F73] border border-slate-200 text-xs font-bold text-slate-700 transition"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Locality Quick Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-sm font-black uppercase tracking-wider text-[#031B2A]">
            Rent by Mumbai Locality
          </h2>
          <Link href="/localities" className="text-xs font-bold text-[#0E8F73] hover:underline">
            All Localities
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
          {localities.slice(0, 10).map((loc) => (
            <Link
              key={loc.slug}
              href={`/mumbai/${loc.slug}`}
              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-[#0E8F73] hover:shadow-xs transition block text-center"
            >
              <div className="text-xs font-bold text-[#031B2A] truncate">{loc.name}</div>
              <div className="text-[10px] text-slate-400 font-medium">from ₹{(loc.avgRent1BHK / 1000).toFixed(0)}k/mo</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Verified Property Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Live Verified Properties in Mumbai
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available for immediate lease with digital tenancy agreement
            </p>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-[#0E8F73] hover:underline flex items-center gap-1"
          >
            <span>Search all filters</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/property/${generatePropertySlug(property)}`}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#0E8F73] transition group flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                  {property.property_images?.[0]?.image_url ? (
                    <img
                      src={property.property_images[0].image_url}
                      alt={property.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No image
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-xs">
                    100% Verified
                  </span>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-base font-black text-[#031B2A]">
                    ₹{property.price?.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </div>
                  <h3 className="font-bold text-xs text-[#031B2A] line-clamp-1 group-hover:text-[#0E8F73] transition">
                    {property.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin size={11} className="text-[#0E8F73]" />
                    <span>{property.locality}, Mumbai</span>
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[11px] font-bold text-slate-600 border-t border-slate-100">
                <span>{property.bedrooms ? `${property.bedrooms} BHK` : 'Studio'}</span>
                <span className="text-[#0E8F73]">Zero Brokerage</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Internal Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
