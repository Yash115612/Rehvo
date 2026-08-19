import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  GitCompare,
  Building,
  Train,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { getPublishedProperties, getLocalityStats } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, unslugify } from '@/lib/seo/slugs';

export const revalidate = 60;

interface ComparePageProps {
  params: { slug: string };
}

function parseComparisonSlugs(slug: string): { loc1Slug: string; loc2Slug: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return null;
  return { loc1Slug: parts[0], loc2Slug: parts[1] };
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const parsed = parseComparisonSlugs(params.slug);
  if (!parsed) {
    return constructSeoMetadata({
      title: 'Compare Localities in Mumbai | REHVO',
      description: 'Compare rent prices, metro connectivity, and rental homes across Mumbai neighbourhoods.',
      canonicalUrl: `https://rehvo.com/compare/${params.slug}`,
    });
  }

  const loc1 = MUMBAI_LOCALITIES[parsed.loc1Slug]?.name || unslugify(parsed.loc1Slug);
  const loc2 = MUMBAI_LOCALITIES[parsed.loc2Slug]?.name || unslugify(parsed.loc2Slug);

  return constructSeoMetadata({
    title: `${loc1} vs ${loc2} Mumbai: Rent Comparison & Commute Guide | REHVO`,
    description: `Detailed comparison between ${loc1} and ${loc2} for renters. Compare average 1 BHK and 2 BHK rent, metro transit lines, lifestyle, and verified zero-brokerage listings.`,
    canonicalUrl: `https://rehvo.com/compare/${params.slug}`,
  });
}

export default async function ComparePage({ params }: ComparePageProps) {
  const parsed = parseComparisonSlugs(params.slug);
  if (!parsed) notFound();

  const info1 = MUMBAI_LOCALITIES[parsed.loc1Slug];
  const info2 = MUMBAI_LOCALITIES[parsed.loc2Slug];

  const name1 = info1?.name || unslugify(parsed.loc1Slug);
  const name2 = info2?.name || unslugify(parsed.loc2Slug);

  const [stats1, stats2] = await Promise.all([
    getLocalityStats('Mumbai', name1),
    getLocalityStats('Mumbai', name2),
  ]);

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: 'Compare', url: '/mumbai' },
    { name: `${name1} vs ${name2}`, url: `/compare/${params.slug}` },
  ];

  const faqs = [
    {
      question: `Which is more affordable for renters: ${name1} or ${name2}?`,
      answer: `${name1} has an estimated average 2 BHK rent of ${info1?.avgRent.bhk2 || 'market rate'}, while ${name2} averages ${info2?.avgRent.bhk2 || 'market rate'}.`,
    },
    {
      question: `How does transit connectivity compare between ${name1} and ${name2}?`,
      answer: `${name1} connects via ${info1?.metroStation || 'local transit'}, while ${name2} is served by ${info2?.metroStation || 'local transit'}.`,
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
            <GitCompare className="w-3.5 h-3.5" /> Locality Comparison
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {name1} vs {name2} — Rent & Commute Comparison
          </h1>

          <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-3xl leading-relaxed">
            Planning your move in Mumbai? Compare average rental rates, metro stations, tech parks, and lifestyle factors between {name1} and {name2}.
          </p>
        </div>

        {/* Comparison Grid */}
        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Locality 1 Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-extrabold text-stone-900">{name1}</h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                    {info1?.zone || 'Mumbai'}
                  </span>
                </div>

                {info1 && (
                  <div className="space-y-4 text-xs text-stone-600 mt-6">
                    <div className="bg-stone-50 p-4 rounded-2xl space-y-2">
                      <span className="font-bold text-stone-900 block text-sm">Rent Benchmarks</span>
                      <div className="flex justify-between"><span>1 BHK:</span> <strong className="text-stone-900">{info1.avgRent.bhk1}</strong></div>
                      <div className="flex justify-between"><span>2 BHK:</span> <strong className="text-stone-900">{info1.avgRent.bhk2}</strong></div>
                      <div className="flex justify-between"><span>3 BHK:</span> <strong className="text-stone-900">{info1.avgRent.bhk3}</strong></div>
                      <div className="flex justify-between"><span>Private Room:</span> <strong className="text-stone-900">{info1.avgRent.room}</strong></div>
                    </div>

                    <div className="p-3">
                      <span className="font-bold text-stone-900 block mb-1">Metro Transit</span>
                      <p>{info1.metroStation}</p>
                    </div>

                    <div className="p-3">
                      <span className="font-bold text-stone-900 block mb-1">Commercial Hubs</span>
                      <p>{info1.commercialHubs.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100">
                <Link
                  href={`/mumbai/${parsed.loc1Slug}`}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  Browse Homes in {name1}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Locality 2 Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-extrabold text-stone-900">{name2}</h2>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-700">
                    {info2?.zone || 'Mumbai'}
                  </span>
                </div>

                {info2 && (
                  <div className="space-y-4 text-xs text-stone-600 mt-6">
                    <div className="bg-stone-50 p-4 rounded-2xl space-y-2">
                      <span className="font-bold text-stone-900 block text-sm">Rent Benchmarks</span>
                      <div className="flex justify-between"><span>1 BHK:</span> <strong className="text-stone-900">{info2.avgRent.bhk1}</strong></div>
                      <div className="flex justify-between"><span>2 BHK:</span> <strong className="text-stone-900">{info2.avgRent.bhk2}</strong></div>
                      <div className="flex justify-between"><span>3 BHK:</span> <strong className="text-stone-900">{info2.avgRent.bhk3}</strong></div>
                      <div className="flex justify-between"><span>Private Room:</span> <strong className="text-stone-900">{info2.avgRent.room}</strong></div>
                    </div>

                    <div className="p-3">
                      <span className="font-bold text-stone-900 block mb-1">Metro Transit</span>
                      <p>{info2.metroStation}</p>
                    </div>

                    <div className="p-3">
                      <span className="font-bold text-stone-900 block mb-1">Commercial Hubs</span>
                      <p>{info2.commercialHubs.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100">
                <Link
                  href={`/mumbai/${parsed.loc2Slug}`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  Browse Homes in {name2}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 mb-14">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Comparison FAQs
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
