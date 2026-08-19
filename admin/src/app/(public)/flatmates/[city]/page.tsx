import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Users, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { getPublishedFlatmates } from '../../../../lib/seo/queries';
import { constructSeoMetadata } from '../../../../lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '../../../../lib/seo/schema';
import { JsonLd } from '../../../../components/public/JsonLd';
import { Breadcrumb } from '../../../../components/public/Breadcrumb';
import { FlatmateCard } from '../../../../components/public/FlatmateCard';
import { AppDownloadBanner } from '../../../../components/public/AppDownloadBanner';
import { unslugify } from '../../../../lib/seo/slugs';

export const revalidate = 60;

interface FlatmatesCityPageProps {
  params: { city: string };
}

export async function generateMetadata({ params }: FlatmatesCityPageProps): Promise<Metadata> {
  const cityName = unslugify(params.city);
  return constructSeoMetadata({
    title: `Verified Flatmates & Roommates in ${cityName} | Zero Brokerage`,
    description: `Connect with verified working professionals and students looking for flatmates and shared apartments in ${cityName}. Zero brokerage flatmate discovery on REHVO.`,
    canonicalUrl: `https://rehvo.com/flatmates/${params.city.toLowerCase()}`,
  });
}

export default async function FlatmatesCityPage({ params }: FlatmatesCityPageProps) {
  const cityName = unslugify(params.city);
  const flatmates = await getPublishedFlatmates(cityName);

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: `Flatmates in ${cityName}`, url: `/flatmates/${params.city.toLowerCase()}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(
    `Verified Flatmates in ${cityName}`,
    flatmates.map((f) => ({
      name: `${f.name} - Flatmate in ${f.locality}, ${cityName}`,
      url: `/flatmates/${params.city.toLowerCase()}`,
      image: f.photo || undefined,
    }))
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mt-4 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5" />
              Roommate Community
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Verified Flatmates in {cityName}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
              Find compatible roommates and shared flats in {cityName}. Browse verified profiles of working professionals and students with transparent budget preferences.
            </p>
          </div>
        </div>

        {/* Flatmate Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              Active Roommate Profiles in {cityName}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              {flatmates.length} verified profiles
            </span>
          </div>

          {flatmates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {flatmates.map((flatmate) => (
                <FlatmateCard key={flatmate.id} flatmate={flatmate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <Users className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                New flatmate profiles in {cityName} are being verified
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-6">
                Create your flatmate profile on the REHVO mobile app to get discovered by people searching for roommates.
              </p>
              <Link
                href="https://rehvo.com/app"
                target="_blank"
                className="inline-block bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Create Profile in App
              </Link>
            </div>
          )}
        </section>

        {/* Flatmate Guide */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 mb-16 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            How to Find Compatible Flatmates in {cityName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-600 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">1. Lifestyle & Habit Matching</h3>
              <p>
                Sharing a flat requires alignment on daily schedules, dietary preferences, guest policies, and cleanliness expectations. REHVO profiles clearly display lifestyle habits and profession to ensure high roommate compatibility.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">2. Budget & Split Arrangements</h3>
              <p>
                Standard flat-sharing in Mumbai involves splitting the total monthly rent, society maintenance, and utility bills equally or by room size. On REHVO, budget ranges are stated upfront to prevent payment mismatches.
              </p>
            </div>
          </div>
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
