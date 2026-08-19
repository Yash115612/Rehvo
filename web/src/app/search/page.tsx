import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building, MapPin, ShieldCheck, Filter, ArrowRight, Wallet, Bed } from 'lucide-react';
import { getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { PropertyCard } from '@/components/public/PropertyCard';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, unslugify } from '@/lib/seo/slugs';

export const revalidate = 60;

interface SearchPageProps {
  searchParams: {
    city?: string;
    locality?: string;
    type?: 'flat' | 'room' | 'pg' | 'studio';
    bedrooms?: string;
    maxPrice?: string;
    furnishing?: 'fully_furnished' | 'semi_furnished' | 'unfurnished';
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const localityName = searchParams.locality
    ? MUMBAI_LOCALITIES[searchParams.locality.toLowerCase()]?.name || unslugify(searchParams.locality)
    : 'Mumbai';

  const typeLabel = searchParams.type ? `${searchParams.type.toUpperCase()}s` : 'Flats & Rooms';

  return constructSeoMetadata({
    title: `${typeLabel} for Rent in ${localityName} | Zero Brokerage Search`,
    description: `Search verified ${typeLabel.toLowerCase()} in ${localityName} with zero brokerage fees. Filter by BHK, budget, and furnishing on REHVO.`,
    canonicalUrl: 'https://rehvo.com/search',
    noIndex: true, // Search result pages should generally be non-indexable to prevent duplicate content
  });
}

export default async function SearchResultsPage({ searchParams }: SearchPageProps) {
  const localitySlug = searchParams.locality?.toLowerCase();
  const localityInfo = localitySlug ? MUMBAI_LOCALITIES[localitySlug] : null;
  const localityName = localityInfo?.name || (searchParams.locality ? unslugify(searchParams.locality) : undefined);

  const maxPriceNum = searchParams.maxPrice ? parseInt(searchParams.maxPrice) : undefined;

  const { properties, totalCount } = await getPublishedProperties({
    city: searchParams.city || 'Mumbai',
    locality: localityName,
    type: searchParams.type,
    bedrooms: searchParams.bedrooms,
    maxPrice: maxPriceNum,
    furnishing: searchParams.furnishing,
    limit: 30,
  });

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: 'Search Results', url: '/search' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(properties, 'Search Results');

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Search Results Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mt-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Results
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {localityName ? `Rentals in ${localityName}` : 'All Verified Rentals in Mumbai'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Showing {properties.length} of {totalCount} zero-brokerage listings matching your criteria
              </p>
            </div>

            {/* Active Filter Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              {searchParams.type && (
                <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-xl capitalize">
                  Type: {searchParams.type}
                </span>
              )}
              {searchParams.bedrooms && (
                <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                  {searchParams.bedrooms} BHK
                </span>
              )}
              {searchParams.maxPrice && (
                <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                  ≤ ₹{parseInt(searchParams.maxPrice).toLocaleString('en-IN')}
                </span>
              )}
              <Link
                href="/mumbai"
                className="text-xs font-bold text-purple-600 hover:text-purple-800 underline px-2 py-1"
              >
                Reset
              </Link>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <section className="mb-16">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop, idx) => (
                <PropertyCard key={prop.id} property={prop} priority={idx < 3} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto my-10">
              <Building className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-stone-800">No properties match your exact filters</h2>
              <p className="text-xs text-stone-500 mt-2 mb-6">
                Try widening your price range or exploring neighbouring Mumbai localities.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/mumbai"
                  className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-5 py-3 rounded-xl transition"
                >
                  Browse All Mumbai Homes
                </Link>
                <Link
                  href="/flatmates/mumbai"
                  className="bg-purple-50 text-purple-700 text-xs font-bold px-5 py-3 rounded-xl hover:bg-purple-100 transition"
                >
                  Find Flatmates
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
