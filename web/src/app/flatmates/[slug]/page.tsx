import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Users,
  ShieldCheck,
  MapPin,
  Sparkles,
  PlusCircle,
  Wallet,
  Home,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { getPublishedFlatmates, getFlatmateById } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { FlatmateCard } from '@/components/public/FlatmateCard';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { unslugify } from '@/lib/seo/slugs';
import { FlatmateMessageButton } from '@/components/public/FlatmateMessageButton';

export const revalidate = 60;

interface FlatmatesDynamicPageProps {
  params: { slug: string };
}

function isUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function generateMetadata({ params }: FlatmatesDynamicPageProps): Promise<Metadata> {
  if (isUuid(params.slug)) {
    const flatmate = await getFlatmateById(params.slug);
    if (flatmate) {
      return constructSeoMetadata({
        title: `${flatmate.name} (${flatmate.profession}) looking for Flatmate in ${flatmate.locality}, ${flatmate.city}`,
        description: `Connect with ${flatmate.name} looking for a ${flatmate.room_preference} in ${flatmate.locality}, ${flatmate.city}. Budget: ₹${flatmate.budget_max}/mo. Zero brokerage on REHVO.`,
        canonicalUrl: `https://rehvo.com/flatmates/${params.slug}`,
      });
    }
  }

  const cityName = unslugify(params.slug);
  return constructSeoMetadata({
    title: `Verified Flatmates & Roommates in ${cityName} | Zero Brokerage`,
    description: `Connect with verified working professionals and students looking for flatmates and shared apartments in ${cityName}. Zero brokerage flatmate discovery on REHVO.`,
    canonicalUrl: `https://rehvo.com/flatmates/${params.slug.toLowerCase()}`,
  });
}

export default async function FlatmatesDynamicPage({ params }: FlatmatesDynamicPageProps) {
  // 1. Check if slug is a specific flatmate profile ID
  if (isUuid(params.slug)) {
    const flatmate = await getFlatmateById(params.slug);
    if (!flatmate) {
      notFound();
    }

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Link
          href="/flatmates/mumbai"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Flatmates Directory</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {flatmate.photo ? (
              <img
                src={flatmate.photo}
                alt={flatmate.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border border-stone-200 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold text-4xl">
                {flatmate.profession.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {flatmate.name}
                {flatmate.age ? `, ${flatmate.age}` : ''}
              </h1>
              <p className="text-xs font-bold text-stone-500">{flatmate.profession}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-stone-600 font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-600" />
                  {flatmate.locality}, {flatmate.city}
                </span>
                <span className="flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-purple-600" />
                  Max ₹{flatmate.budget_max.toLocaleString('en-IN')}/mo
                </span>
                <span className="flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-purple-600" />
                  {flatmate.room_preference.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <FlatmateMessageButton
              flatmateId={flatmate.id}
              userId={flatmate.user_id}
              name={flatmate.name}
            />
          </div>

          {flatmate.bio && (
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 space-y-1.5">
              <span className="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">
                About Me
              </span>
              <p className="text-xs text-stone-700 leading-relaxed">{flatmate.bio}</p>
            </div>
          )}

          {flatmate.lifestyle_preferences && flatmate.lifestyle_preferences.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider block">
                Preferences & Routine
              </span>
              <div className="flex flex-wrap gap-2">
                {flatmate.lifestyle_preferences.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-50 text-purple-700 border border-purple-100 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Otherwise render City Directory
  const cityName = unslugify(params.slug);
  const flatmates = await getPublishedFlatmates(cityName);

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: `Flatmates in ${cityName}`, url: `/flatmates/${params.slug.toLowerCase()}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(
    `Verified Flatmates in ${cityName}`,
    flatmates.map((f) => ({
      name: `${f.name} - Flatmate in ${f.locality}, ${cityName}`,
      url: `/flatmates/${f.id}`,
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
              Verified Roommates
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Verified Flatmates & Roommates in {cityName}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
              Connect directly with working professionals and students looking for roommates across {cityName} with zero brokerage and verified profiles.
            </p>
          </div>
        </div>

        {/* Flatmates Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              Active Roommates in {cityName}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              {flatmates.length} {flatmates.length === 1 ? 'profile' : 'profiles'} available
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
                Be the first to create your flatmate profile in {cityName} and find compatible roommates.
              </p>
              <Link
                href="/flatmates/create"
                className="inline-block bg-purple-600 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-purple-700 transition"
              >
                Create Flatmate Profile
              </Link>
            </div>
          )}
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
