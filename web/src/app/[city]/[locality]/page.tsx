import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Train,
  GraduationCap,
  Hospital,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  HelpCircle,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { LOCALITIES_DATA, CITIES_DATA } from '@/lib/seo/localityData';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateFaqSchema, generateItemListSchema } from '@/lib/seo/schema';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { LocalityClusterMap } from '@/components/maps/LocalityClusterMap';

export const revalidate = 3600; // 1 hour

interface LocalityPageProps {
  params: { city: string; locality: string };
}

export async function generateStaticParams() {
  return Object.values(LOCALITIES_DATA).map((loc) => ({
    city: loc.citySlug,
    locality: loc.slug,
  }));
}

export async function generateMetadata({ params }: LocalityPageProps): Promise<Metadata> {
  const locality = LOCALITIES_DATA[params.locality.toLowerCase()];
  const city = CITIES_DATA[params.city.toLowerCase()];

  if (!locality || !city) {
    return { title: 'Locality Rentals | REHVO' };
  }

  return constructSeoMetadata({
    title: `Flats, Rooms & Flatmates for Rent in ${locality.name}, ${city.name} | Zero Brokerage`,
    description: `Browse 100% verified 1, 2 & 3 BHK flats, apartments, PGs and flatmates for rent in ${locality.name}, ${city.name}. Average 2 BHK rent ₹${locality.avgRent2BHK.toLocaleString('en-IN')}/mo with direct owner chat and instant physical visit booking on REHVO.`,
    canonicalUrl: `/${city.slug}/${locality.slug}`,
    keywords: [
      `flats for rent in ${locality.name.toLowerCase()}`,
      `apartments in ${locality.name.toLowerCase()}`,
      `flatmates ${locality.name.toLowerCase()}`,
      `pg in ${locality.name.toLowerCase()}`,
      `zero brokerage ${locality.name.toLowerCase()}`,
      `1 bhk in ${locality.name.toLowerCase()}`,
      `2 bhk in ${locality.name.toLowerCase()}`,
      `3 bhk in ${locality.name.toLowerCase()}`,
      `rent in ${locality.name.toLowerCase()} ${city.name.toLowerCase()}`,
    ],
  });
}

export default async function LocalityPage({ params }: LocalityPageProps) {
  const citySlug = params.city.toLowerCase();
  const localitySlug = params.locality.toLowerCase();

  const city = CITIES_DATA[citySlug];
  const locality = LOCALITIES_DATA[localitySlug];

  if (!city || !locality) {
    notFound();
  }

  // Fetch verified properties in this locality
  const { properties } = await getPublishedProperties({
    city: city.name,
    locality: locality.name,
    limit: 12,
  });

  const breadcrumbs = [
    { name: city.name, url: `/${city.slug}` },
    { name: locality.name, url: `/${city.slug}/${locality.slug}` },
  ];

  const faqSchema = generateFaqSchema(locality.faqs);
  const itemListSchema = generateItemListSchema(
    `Properties for Rent in ${locality.name}`,
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      {/* Structured Data Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Top Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>100% Verified Direct Owners</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              <TrendingUp size={14} />
              <span>Rental Yield: {locality.rentalYield}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
            Flats & Apartments for Rent in {locality.name}, {city.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {locality.description}
          </p>

          {/* Locality Price Benchmark Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">1 BHK Flat</span>
              <div className="text-base sm:text-xl font-black text-[#031B2A] mt-0.5">
                ₹{(locality.avgRent1BHK / 1000).toFixed(0)}k<span className="text-[10px] text-slate-400">/mo</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
              <span className="text-[10px] font-bold text-[#0E8F73] uppercase tracking-wider">2 BHK Flat</span>
              <div className="text-base sm:text-xl font-black text-[#0E8F73] mt-0.5">
                ₹{(locality.avgRent2BHK / 1000).toFixed(0)}k<span className="text-[10px] text-emerald-600/70">/mo</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">3 BHK Flat</span>
              <div className="text-base sm:text-xl font-black text-[#031B2A] mt-0.5">
                ₹{(locality.avgRent3BHK / 1000).toFixed(0)}k<span className="text-[10px] text-slate-400">/mo</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Co-Living / PG</span>
              <div className="text-base sm:text-xl font-black text-[#031B2A] mt-0.5">
                ₹{(locality.avgRentPG / 1000).toFixed(0)}k<span className="text-[10px] text-slate-400">/bed</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Shared Flatmate</span>
              <div className="text-base sm:text-xl font-black text-[#031B2A] mt-0.5">
                ₹{(locality.avgRentFlatmate / 1000).toFixed(0)}k<span className="text-[10px] text-slate-400">/room</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Verified Listings Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Verified Homes in {locality.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Zero brokerage listings directly from homeowners
            </p>
          </div>
          <Link
            href={`/search?city=${encodeURIComponent(city.name)}&locality=${encodeURIComponent(locality.name)}`}
            className="text-xs font-bold text-[#0E8F73] hover:underline flex items-center gap-1"
          >
            <span>View all in {locality.name}</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        {properties.length > 0 ? (
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
                        alt={`${property.title} in ${locality.name}`}
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
                      <span>{property.locality}, {city.name}</span>
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
        ) : (
          <div className="p-10 rounded-2xl bg-white border border-slate-200 text-center space-y-3 mt-6">
            <Home size={28} className="mx-auto text-slate-400" />
            <p className="text-xs font-bold text-slate-800">
              New verified homes are currently being onboarded in {locality.name}.
            </p>
            <Link
              href="/search"
              className="inline-block px-4 py-2 rounded-xl bg-[#0E8F73] text-white text-xs font-bold hover:bg-[#10B981] transition"
            >
              Browse All Mumbai Properties
            </Link>
          </div>
        )}
      </section>

      {/* Interactive Locality Map & Clusters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <LocalityClusterMap
          localityName={locality.name}
          cityName={city.name}
          latitude={locality.coordinates?.lat || 19.1363}
          longitude={locality.coordinates?.lng || 72.8277}
          properties={properties}
        />
      </section>

      {/* Locality Infrastructure & Amenities Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-[#031B2A]">
              Neighborhood Infrastructure & Connectivity — {locality.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Public transit, healthcare, education, and lifestyle hotspots evaluated by REHVO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metro & Transit */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-[#0E8F73] font-bold text-xs">
                <Train size={16} />
                <span>Metro & Rail Transit</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {locality.metroLines.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-[#0E8F73] shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Schools */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
                <GraduationCap size={16} />
                <span>Schools & Colleges</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {locality.topSchools.map((school, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>{school}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Hospitals */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <Hospital size={16} />
                <span>Hospitals & Healthcare</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {locality.topHospitals.map((hosp, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>{hosp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lifestyle Hubs */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-600 font-bold text-xs">
                <ShoppingBag size={16} />
                <span>Shopping & Cafes</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {locality.lifestyleHubs.map((hub, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-purple-600 shrink-0 mt-0.5" />
                    <span>{hub}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      {locality.faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0E8F73]" />
              <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
                Frequently Asked Questions — Renting in {locality.name}
              </h2>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {locality.faqs.map((faq, idx) => (
                <div key={idx} className="pt-4 first:pt-0 space-y-1.5">
                  <h3 className="text-sm font-bold text-[#031B2A]">{faq.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal Linking Mesh */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity={city.slug} currentLocality={locality.slug} />
      </div>
    </div>
  );
}
