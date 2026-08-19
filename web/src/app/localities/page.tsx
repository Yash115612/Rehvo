import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin, Building, ArrowRight, Train, Sparkles, HelpCircle } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return constructSeoMetadata({
    title: 'Mumbai Localities Directory — Zero-Brokerage Flats & Rooms | REHVO',
    description:
      'Complete directory of Mumbai neighbourhoods for renters. Explore Western Suburbs, Central Mumbai, South Mumbai, and Navi Mumbai with rent benchmarks and zero brokerage on REHVO.',
    canonicalUrl: 'https://rehvo.com/localities',
  });
}

export default function LocalitiesDirectoryPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Mumbai', url: '/mumbai' },
    { name: 'Localities Directory', url: '/localities' },
  ];

  // Group localities by zone
  const zones: Record<string, { slug: string; info: (typeof MUMBAI_LOCALITIES)[string] }[]> = {};

  Object.entries(MUMBAI_LOCALITIES).forEach(([slug, info]) => {
    const z = info.zone || 'Other Mumbai';
    if (!zones[z]) zones[z] = [];
    zones[z].push({ slug, info });
  });

  const faqs = [
    {
      question: 'Which is the best locality in Mumbai for working professionals?',
      answer:
        'Andheri West, Bandra West, and Powai are among the most popular choices due to dual-metro connectivity, proximity to business hubs (BKC, SEEPZ, Mindspace), and vibrant food & cafe culture.',
    },
    {
      question: 'How does REHVO eliminate brokerage across all Mumbai localities?',
      answer:
        'REHVO operates on a direct-to-owner model with verified identity checks, connecting tenants and owners without middleman brokers.',
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFaqSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mt-4 mb-10">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3 w-fit">
            <MapPin className="w-3.5 h-3.5" /> Mumbai Neighbourhood Directory
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Explore All Mumbai Localities
          </h1>

          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-3xl leading-relaxed">
            Find zero-brokerage rental homes, private rooms, and PGs across Western Suburbs, South Mumbai, Central Suburbs, Thane, and Navi Mumbai.
          </p>
        </div>

        {/* Zones Directory Grid */}
        <div className="space-y-12 mb-16">
          {Object.entries(zones).map(([zoneName, items]) => (
            <section key={zoneName} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 bg-purple-600 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                  {zoneName}
                </h2>
                <span className="text-xs text-stone-500 font-medium">
                  ({items.length} {items.length === 1 ? 'neighbourhood' : 'neighbourhoods'})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(({ slug, info }) => (
                  <div
                    key={slug}
                    className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Link href={`/mumbai/${slug}`} className="hover:text-purple-600 transition">
                          <h3 className="text-lg font-bold text-stone-900">{info.name}</h3>
                        </Link>
                        <span className="text-[11px] font-semibold text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-md">
                          {info.pincode || 'Mumbai'}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs text-stone-600 my-4">
                        <div className="bg-stone-50 p-3 rounded-xl flex items-center justify-between">
                          <span className="text-stone-500 font-medium">Avg. 2 BHK:</span>
                          <strong className="text-stone-900">{info.avgRent.bhk2}</strong>
                        </div>

                        <div className="flex items-start gap-2 text-stone-500">
                          <Train className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{info.metroStation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-2">
                      <Link
                        href={`/mumbai/${slug}`}
                        className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-2 px-3 rounded-xl text-center transition"
                      >
                        All Homes
                      </Link>
                      <Link
                        href={`/mumbai/${slug}/1-bhk-flats-for-rent`}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold py-2 px-3 rounded-xl transition"
                      >
                        1 BHK
                      </Link>
                      <Link
                        href={`/mumbai/${slug}/2-bhk-flats-for-rent`}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold py-2 px-3 rounded-xl transition"
                      >
                        2 BHK
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* FAQs Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 mb-14">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Mumbai Neighbourhood Guide FAQs
            </h2>
          </div>

          <div className="space-y-6 divide-y divide-stone-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                <h3 className="text-base font-bold text-stone-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
