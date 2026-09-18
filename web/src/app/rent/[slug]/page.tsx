import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { generateItemListSchema, generateFaqSchema } from '@/lib/seo/schema';

export const revalidate = 3600;

import { SEARCH_LANDING_PAGES, SearchLandingProfile } from '@/lib/seo/rentData';

export async function generateStaticParams() {
  return Object.keys(SEARCH_LANDING_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const landing = SEARCH_LANDING_PAGES[params.slug];
  if (!landing) {
    return { title: 'Rental Properties | REHVO' };
  }

  return constructSeoMetadata({
    title: landing.metaTitle,
    description: landing.metaDescription,
    canonicalUrl: `https://rehvo.in/rent/${landing.slug}`,
    keywords: [
      landing.title.toLowerCase(),
      'zero brokerage',
      'verified flats mumbai',
      'direct owner rent',
      'rehvo',
    ],
  });
}

export default async function SearchLandingPage({ params }: { params: { slug: string } }) {
  const landing = SEARCH_LANDING_PAGES[params.slug];
  if (!landing) {
    notFound();
  }

  const { properties } = await getPublishedProperties({
    city: 'Mumbai',
    locality: landing.localityFilter,
    limit: 8,
  });

  const breadcrumbs = [
    { name: 'Rentals', url: '/rent' },
    { name: landing.title, url: `/rent/${landing.slug}` },
  ];

  const faqSchema = generateFaqSchema(landing.faqs);
  const itemListSchema = generateItemListSchema(
    landing.title,
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
    }))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Zero Brokerage Guaranteed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              <TrendingUp size={14} />
              <span>Price Range: {landing.priceRange}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
            {landing.heading}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {landing.subheading}
          </p>
        </div>
      </header>

      {/* Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Verified Listings Matching “{landing.title}”
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact homeowners directly without middleman fees
            </p>
          </div>
          <Link href="/search" className="text-xs font-bold text-[#0E8F73] hover:underline flex items-center gap-1">
            <span>Filter all options</span>
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
                    <Image
                      src={property.property_images[0].image_url}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No image
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-xs z-10">
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

      {/* FAQs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-[#031B2A]">Frequently Asked Questions</h2>
          <div className="space-y-3 divide-y divide-slate-100">
            {landing.faqs.map((faq, idx) => (
              <div key={idx} className="pt-3 first:pt-0 space-y-1">
                <h3 className="text-xs font-bold text-[#031B2A]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Linking */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
