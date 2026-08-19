import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Building, MapPin, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { getPublishedProperties, getLocalityStats } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { PropertyCard } from '@/components/public/PropertyCard';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, unslugify, generatePropertySlug } from '@/lib/seo/slugs';

export const revalidate = 60;

interface LocalityPageProps {
  params: { locality: string };
}

export async function generateMetadata({ params }: LocalityPageProps): Promise<Metadata> {
  const localitySlug = params.locality.toLowerCase();
  const localityInfo = MUMBAI_LOCALITIES[localitySlug];
  const localityName = localityInfo ? localityInfo.name : unslugify(localitySlug);

  return constructSeoMetadata({
    title: `Flats & Rooms for Rent in ${localityName}, Mumbai | Zero Brokerage`,
    description: `Browse verified zero-brokerage flats, private rooms, and PGs for rent in ${localityName}, Mumbai. Direct owner contacts, real photos, and instant visit booking on REHVO.`,
    canonicalUrl: `https://rehvo.com/mumbai/${localitySlug}`,
  });
}

export default async function LocalityPage({ params }: LocalityPageProps) {
  const localitySlug = params.locality.toLowerCase();
  const localityInfo = MUMBAI_LOCALITIES[localitySlug];
  const localityName = localityInfo ? localityInfo.name : unslugify(localitySlug);

  const [{ properties, totalCount }, stats] = await Promise.all([
    getPublishedProperties({
      city: 'Mumbai',
      locality: localityName,
      limit: 24,
    }),
    getLocalityStats('Mumbai', localityName),
  ]);

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: localityName, url: `/mumbai/${localitySlug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(
    `Properties for Rent in ${localityName}, Mumbai`,
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
      price: p.price,
    }))
  );

  // Nearby localities
  const nearbyLocalities = Object.entries(MUMBAI_LOCALITIES)
    .filter(([slug]) => slug !== localitySlug)
    .slice(0, 4);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Locality Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mt-4 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5" />
              {localityInfo?.zone || 'Mumbai'} • Zero Brokerage
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Flats & Rooms for Rent in {localityName}, Mumbai
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
              Find verified apartments, single rooms, and PGs available for rent in {localityName}. Direct connection with verified property owners without broker intermediaries.
            </p>
          </div>

          {/* Locality Stats Banner */}
          {stats.totalListings > 0 && (
            <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-stone-50 p-3.5 rounded-2xl">
                <span className="text-[11px] text-stone-500 font-medium block">Total Verified</span>
                <span className="text-lg font-extrabold text-stone-900">{stats.totalListings} Homes</span>
              </div>
              <div className="bg-stone-50 p-3.5 rounded-2xl">
                <span className="text-[11px] text-stone-500 font-medium block">Starting Rent</span>
                <span className="text-lg font-extrabold text-emerald-600">₹{stats.minRent.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="bg-stone-50 p-3.5 rounded-2xl">
                <span className="text-[11px] text-stone-500 font-medium block">Average Rent</span>
                <span className="text-lg font-extrabold text-stone-900">₹{stats.avgRent.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="bg-stone-50 p-3.5 rounded-2xl">
                <span className="text-[11px] text-stone-500 font-medium block">Brokerage Fee</span>
                <span className="text-lg font-extrabold text-purple-600">₹0 (Zero)</span>
              </div>
            </div>
          )}

          {/* Sub-Category Navigation */}
          <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <Link
              href={`/mumbai/${localitySlug}/flats-for-rent`}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
            >
              Flats for Rent in {localityName}
            </Link>
            <Link
              href={`/mumbai/${localitySlug}/rooms-for-rent`}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              Rooms for Rent in {localityName}
            </Link>
            <Link
              href={`/mumbai/${localitySlug}/pg`}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
            >
              PG in {localityName}
            </Link>
          </div>
        </div>

        {/* Listings in this Locality */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              Verified Properties in {localityName}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              {totalCount} {totalCount === 1 ? 'property' : 'properties'} listed
            </span>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, idx) => (
                <PropertyCard key={property.id} property={property} priority={idx < 3} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
              <Building className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                New listings in {localityName} are being verified
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-6">
                Homeowners in {localityName} post properties directly on REHVO. Check back shortly or browse nearby neighbourhoods.
              </p>
              <Link
                href="/mumbai"
                className="inline-block bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Browse All Mumbai Rentals
              </Link>
            </div>
          )}
        </section>

        {/* Locality Insights Guide */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 mb-16 space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Living in {localityName}, Mumbai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-stone-600 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">Neighborhood Profile & Connectivity</h3>
              <p>
                {localityName} is one of Mumbai&apos;s most active residential hubs, favored by working professionals, students, and families. The area enjoys seamless connectivity via local trains, metro lines, and arterial roads to key business centers.
              </p>
              <p>
                Commercial amenities including supermarkets, cafes, fitness centers, and medical facilities are within walking distance of most residential complexes.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-stone-900">Zero-Brokerage Rentals with REHVO</h3>
              <p>
                Renters in {localityName} traditionally pay 1-2 months of rent as broker commission. On REHVO, you connect directly with verified property owners and flatmates, saving ₹35,000 to ₹90,000 in brokerage fees.
              </p>
              <p>
                Every listing undergoes identity verification to ensure genuine property details, accurate photographs, and transparent pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Nearby Localities */}
        <section className="my-16">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            Explore Nearby Localities in Mumbai
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {nearbyLocalities.map(([slug, info]) => (
              <Link
                key={slug}
                href={`/mumbai/${slug}`}
                className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-purple-300 hover:shadow-sm transition flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{info.name}</h3>
                  <p className="text-[11px] text-stone-500">{info.zone}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-purple-600" />
              </Link>
            ))}
          </div>
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
