import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Building2,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { CITIES_DATA, LOCALITIES_DATA } from '@/lib/seo/localityData';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateFaqSchema, generateItemListSchema } from '@/lib/seo/schema';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';

export const revalidate = 3600; // 1 hour

interface CityPageProps {
  params: { city: string };
}

export async function generateStaticParams() {
  return Object.keys(CITIES_DATA).map((city) => ({ city }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = CITIES_DATA[params.city.toLowerCase()];
  if (!city) {
    return { title: 'City Rentals | REHVO' };
  }

  return constructSeoMetadata({
    title: `Verified Flats, Rooms & PGs for Rent in ${city.name}`,
    description: `Browse 100% verified flats, apartments, flatmates and PGs for rent in ${city.name}. Direct owner listings, AI concierge matching, zero broker fees, and verified Index-II title deeds on REHVO.`,
    canonicalUrl: `https://rehvo.in/${city.slug}`,
    keywords: [
      `rent in ${city.name.toLowerCase()}`,
      `flats for rent in ${city.name.toLowerCase()}`,
      `apartments ${city.name.toLowerCase()}`,
      `zero brokerage ${city.name.toLowerCase()}`,
      `flatmates in ${city.name.toLowerCase()}`,
      `pg in ${city.name.toLowerCase()}`,
      `direct owner rentals ${city.name.toLowerCase()}`,
    ],
  });
}

export default async function CityPage({ params }: CityPageProps) {
  const citySlug = params.city.toLowerCase();
  const city = CITIES_DATA[citySlug];

  if (!city) {
    notFound();
  }

  // Fetch verified properties in this city
  const { properties } = await getPublishedProperties({
    city: city.name,
    limit: 8,
  });

  const cityLocalities = Object.values(LOCALITIES_DATA).filter(
    (l) => l.citySlug === city.slug || l.city.toLowerCase() === city.name.toLowerCase()
  );

  const breadcrumbs = [{ name: city.name, url: `/${city.slug}` }];
  const faqSchema = generateFaqSchema(city.faqs);
  const itemListSchema = generateItemListSchema(
    `Verified Properties in ${city.name}`,
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      {/* Schema.org Injections */}
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
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
            <ShieldCheck size={14} />
            <span>100% Verified Direct Owner Listings</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
            Verified Flats & Apartments for Rent in {city.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {city.description}
          </p>

          {/* City Average Rent Matrix */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg 1 BHK Rent</span>
              <div className="text-lg sm:text-2xl font-black text-[#031B2A] mt-0.5">
                ₹{city.avgRent1BHK.toLocaleString('en-IN')}<span className="text-xs font-medium text-slate-400">/mo</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center">
              <span className="text-[11px] font-bold text-[#0E8F73] uppercase tracking-wider">Avg 2 BHK Rent</span>
              <div className="text-lg sm:text-2xl font-black text-[#0E8F73] mt-0.5">
                ₹{city.avgRent2BHK.toLocaleString('en-IN')}<span className="text-xs font-medium text-emerald-600/70">/mo</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg 3 BHK Rent</span>
              <div className="text-lg sm:text-2xl font-black text-[#031B2A] mt-0.5">
                ₹{city.avgRent3BHK.toLocaleString('en-IN')}<span className="text-xs font-medium text-slate-400">/mo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top Localities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Explore Top Localities in {city.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare rental prices, metro connectivity, and verified direct-owner listings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {cityLocalities.map((loc) => (
            <Link
              key={loc.slug}
              href={`/${city.slug}/${loc.slug}`}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0E8F73] hover:shadow-md transition-all group block space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#0E8F73] flex items-center justify-center font-black text-xs">
                    <MapPin size={16} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#031B2A] group-hover:text-[#0E8F73] transition">
                    {loc.name}
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {loc.rentalYield} Yield
                </span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">
                {loc.tagline}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">2 BHK from <strong className="text-slate-900">₹{(loc.avgRent2BHK / 1000).toFixed(0)}k/mo</strong></span>
                <span className="text-[#0E8F73] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  Explore <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Verified Properties */}
      {properties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
                Latest Verified Listings in {city.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical walkthrough verified by REHVO field executives
              </p>
            </div>
            <Link
              href={`/search?city=${encodeURIComponent(city.name)}`}
              className="text-xs font-bold text-[#0E8F73] hover:underline flex items-center gap-1"
            >
              <span>View all {city.name} homes</span>
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
                      Verified
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
        </section>
      )}

      {/* Frequently Asked Questions */}
      {city.faqs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0E8F73]" />
              <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
                Frequently Asked Questions — Renting in {city.name}
              </h2>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {city.faqs.map((faq, idx) => (
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
        <InternalLinksGrid currentCity={city.slug} />
      </div>
    </div>
  );
}
