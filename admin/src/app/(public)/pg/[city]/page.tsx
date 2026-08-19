import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building2, ShieldCheck, MapPin } from 'lucide-react';
import { getPublishedProperties } from '../../../../lib/seo/queries';
import { constructSeoMetadata } from '../../../../lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '../../../../lib/seo/schema';
import { JsonLd } from '../../../../components/public/JsonLd';
import { Breadcrumb } from '../../../../components/public/Breadcrumb';
import { PropertyCard } from '../../../../components/public/PropertyCard';
import { AppDownloadBanner } from '../../../../components/public/AppDownloadBanner';
import { unslugify, generatePropertySlug } from '../../../../lib/seo/slugs';

export const revalidate = 60;

interface PgCityPageProps {
  params: { city: string };
}

export async function generateMetadata({ params }: PgCityPageProps): Promise<Metadata> {
  const cityName = unslugify(params.city);
  return constructSeoMetadata({
    title: `PG in ${cityName} | Zero Brokerage Paying Guest & Co-Living`,
    description: `Find verified PG and co-living hostels in ${cityName}. Zero brokerage, furnished rooms, high-speed WiFi, and transparent security deposits on REHVO.`,
    canonicalUrl: `https://rehvo.com/pg/${params.city.toLowerCase()}`,
  });
}

export default async function PgCityPage({ params }: PgCityPageProps) {
  const cityName = unslugify(params.city);
  const { properties, totalCount } = await getPublishedProperties({
    city: cityName,
    type: 'pg',
    limit: 24,
  });

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: `PG in ${cityName}`, url: `/pg/${params.city.toLowerCase()}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(
    `PG Accommodations in ${cityName}`,
    properties.map((p) => ({
      name: p.title,
      url: `/property/${generatePropertySlug(p)}`,
      image: p.property_images?.[0]?.image_url,
      price: p.price,
    }))
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mt-4 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5" />
              Co-Living & Hostels
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              PG & Co-Living Accommodations in {cityName}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
              Explore verified paying guest hostels, student housing, and co-living residences across {cityName} with zero brokerage and verified amenities.
            </p>
          </div>
        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              Available PGs in {cityName}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              {totalCount} {totalCount === 1 ? 'PG' : 'PGs'} listed
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
              <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                New PGs in {cityName} are being onboarded
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-6">
                Explore private rooms and shared flats in {cityName} or browse all rental listings.
              </p>
              <Link
                href="/mumbai"
                className="inline-block bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                Browse Mumbai Rentals
              </Link>
            </div>
          )}
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
