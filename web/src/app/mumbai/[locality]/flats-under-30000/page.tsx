import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building, MapPin, ShieldCheck, CheckCircle2, ArrowRight, Wallet } from 'lucide-react';
import { getPublishedProperties, getLocalityStats } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { PropertyCard } from '@/components/public/PropertyCard';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, unslugify } from '@/lib/seo/slugs';

export const revalidate = 60;

interface Budget30kPageProps {
  params: { locality: string };
}

export async function generateMetadata({ params }: Budget30kPageProps): Promise<Metadata> {
  const localityKey = params.locality.toLowerCase();
  const info = MUMBAI_LOCALITIES[localityKey];
  const localityName = info?.name || unslugify(params.locality);

  return constructSeoMetadata({
    title: `Flats for Rent Under ₹30,000 in ${localityName} Mumbai | Zero Brokerage`,
    description: `Find affordable 1 BHK, 2 BHK & studio flats for rent under ₹30k in ${localityName}, Mumbai with zero brokerage. Verified owners and direct contact on REHVO.`,
    canonicalUrl: `https://rehvo.com/mumbai/${params.locality}/flats-under-30000`,
  });
}

export default async function Budget30kPage({ params }: Budget30kPageProps) {
  const localityKey = params.locality.toLowerCase();
  const localityInfo = MUMBAI_LOCALITIES[localityKey];
  const localityName = localityInfo?.name || unslugify(params.locality);

  const { properties, totalCount } = await getPublishedProperties({
    city: 'Mumbai',
    locality: localityName,
    type: 'flat',
    maxPrice: 30000,
    limit: 20,
  });

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: localityName, url: `/mumbai/${params.locality}` },
    { name: 'Under ₹30,000', url: `/mumbai/${params.locality}/flats-under-30000` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(properties, `Flats for Rent Under ₹30,000 in ${localityName}, Mumbai`);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mt-4 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Zero Brokerage
            </span>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              Budget Friendly ≤ ₹30k/month
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Flats for Rent Under ₹30,000 in {localityName}, Mumbai
          </h1>
          <p className="text-base text-stone-600 mt-3 max-w-3xl leading-relaxed">
            Discover pocket-friendly rental apartments in {localityName} priced under ₹30,000 per month. Direct owner connection with zero brokerage fees.
          </p>
        </div>

        {/* Listings Section */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                Affordable Rentals Under ₹30k in {localityName}
              </h2>
              <p className="text-sm text-stone-500 mt-0.5">
                Showing {properties.length} of {totalCount} verified homes
              </p>
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop, idx) => (
                <PropertyCard key={prop.id} property={prop} priority={idx < 3} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center max-w-2xl mx-auto my-6">
              <Building className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-stone-800">No flats under ₹30,000 currently in {localityName}</h3>
              <p className="text-sm text-stone-500 mt-2 mb-6">
                Consider private rooms or explore flats under ₹50,000 in {localityName}.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/mumbai/${params.locality}/flats-under-50000`}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Flats Under ₹50k in {localityName}
                </Link>
                <Link
                  href={`/mumbai/${params.locality}/rooms-for-rent`}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Private Rooms in {localityName}
                </Link>
              </div>
            </div>
          )}
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
