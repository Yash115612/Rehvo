import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, MapPin } from 'lucide-react';
import { getPublishedProperties } from '../../../../../lib/seo/queries';
import { constructSeoMetadata } from '../../../../../lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '../../../../../lib/seo/schema';
import { JsonLd } from '../../../../../components/public/JsonLd';
import { Breadcrumb } from '../../../../../components/public/Breadcrumb';
import { PropertyCard } from '../../../../../components/public/PropertyCard';
import { AppDownloadBanner } from '../../../../../components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, unslugify, generatePropertySlug } from '../../../../../lib/seo/slugs';

export const revalidate = 60;

interface StudiosForRentPageProps {
  params: { locality: string };
}

export async function generateMetadata({ params }: StudiosForRentPageProps): Promise<Metadata> {
  const localitySlug = params.locality.toLowerCase();
  const localityInfo = MUMBAI_LOCALITIES[localitySlug];
  const localityName = localityInfo ? localityInfo.name : unslugify(localitySlug);

  return constructSeoMetadata({
    title: `Studio Apartments for Rent in ${localityName}, Mumbai | Zero Brokerage`,
    description: `Find 1 RK and studio apartments for rent in ${localityName}, Mumbai with zero brokerage. Direct owner contact and verified images on REHVO.`,
    canonicalUrl: `https://rehvo.com/mumbai/${localitySlug}/studios-for-rent`,
  });
}

export default async function StudiosForRentPage({ params }: StudiosForRentPageProps) {
  const localitySlug = params.locality.toLowerCase();
  const localityInfo = MUMBAI_LOCALITIES[localitySlug];
  const localityName = localityInfo ? localityInfo.name : unslugify(localitySlug);

  const { properties, totalCount } = await getPublishedProperties({
    city: 'Mumbai',
    locality: localityName,
    type: 'studio',
    limit: 24,
  });

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: localityName, url: `/mumbai/${localitySlug}` },
    { name: 'Studios for Rent', url: `/mumbai/${localitySlug}/studios-for-rent` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(
    `Studio Apartments for Rent in ${localityName}, Mumbai`,
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
              <Sparkles className="w-3.5 h-3.5" />
              1 RK & Studio Living
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Studio Apartments for Rent in {localityName}, Mumbai
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
              Explore compact, fully functional 1 RK and studio homes in {localityName} directly from homeowners.
            </p>
          </div>
        </div>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-stone-900">
              Available Studios in {localityName}
            </h2>
            <span className="text-xs font-medium text-stone-500">
              {totalCount} {totalCount === 1 ? 'studio' : 'studios'} listed
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
              <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                No studio apartments currently available in {localityName}
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-6">
                Browse flats and rooms in {localityName} or explore studios across Mumbai.
              </p>
              <Link
                href={`/mumbai/${localitySlug}`}
                className="inline-block bg-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                View all in {localityName}
              </Link>
            </div>
          )}
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
