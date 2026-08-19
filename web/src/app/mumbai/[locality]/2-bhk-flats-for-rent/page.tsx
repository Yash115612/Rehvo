import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Building, MapPin, ShieldCheck, CheckCircle2, ArrowRight, HelpCircle } from 'lucide-react';
import { getPublishedProperties, getLocalityStats } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateItemListSchema, generateFaqSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { PropertyCard } from '@/components/public/PropertyCard';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { MUMBAI_LOCALITIES, unslugify } from '@/lib/seo/slugs';

export const revalidate = 60;

interface Bhk2PageProps {
  params: { locality: string };
}

export async function generateMetadata({ params }: Bhk2PageProps): Promise<Metadata> {
  const localityKey = params.locality.toLowerCase();
  const info = MUMBAI_LOCALITIES[localityKey];
  const localityName = info?.name || unslugify(params.locality);

  return constructSeoMetadata({
    title: `2 BHK Flats for Rent in ${localityName} Mumbai | Zero Brokerage`,
    description: `Browse verified 2 BHK apartments for rent in ${localityName}, Mumbai with zero brokerage. Direct owner chat, verified photos, transparent pricing, and instant visit bookings on REHVO.`,
    canonicalUrl: `https://rehvo.com/mumbai/${params.locality}/2-bhk-flats-for-rent`,
  });
}

export default async function Bhk2Page({ params }: Bhk2PageProps) {
  const localityKey = params.locality.toLowerCase();
  const localityInfo = MUMBAI_LOCALITIES[localityKey];
  const localityName = localityInfo?.name || unslugify(params.locality);

  const [{ properties, totalCount }, stats] = await Promise.all([
    getPublishedProperties({
      city: 'Mumbai',
      locality: localityName,
      type: 'flat',
      bedrooms: '2',
      limit: 20,
    }),
    getLocalityStats('Mumbai', localityName),
  ]);

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: localityName, url: `/mumbai/${params.locality}` },
    { name: '2 BHK Flats', url: `/mumbai/${params.locality}/2-bhk-flats-for-rent` },
  ];

  const faqs = [
    {
      question: `What is the typical rent for a 2 BHK apartment in ${localityName}?`,
      answer: `Average 2 BHK rentals in ${localityName} generally range between ${localityInfo?.avgRent?.bhk2 || '₹45,000 - ₹75,000'} per month based on building amenities, carpet area, parking availability, and proximity to transit stations.`,
    },
    {
      question: `Can I rent a 2 BHK in ${localityName} without paying brokerage?`,
      answer: `Yes, 100%. All 2 BHK listings on REHVO are direct-from-owner with zero brokerage fees.`,
    },
    {
      question: `What is the standard security deposit for 2 BHK flats in ${localityName}?`,
      answer: `Security deposits typically range from 2 to 3 months of rent in Mumbai residential societies and are agreed directly between tenant and owner.`,
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const itemListSchema = generateItemListSchema(properties, `2 BHK Flats for Rent in ${localityName}, Mumbai`);
  const faqSchema = generateFaqSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={itemListSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm mt-4 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Zero Brokerage
            </span>
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              2 BHK Family & Shared Homes
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            2 BHK Flats for Rent in {localityName}, Mumbai
          </h1>
          <p className="text-base text-stone-600 mt-3 max-w-3xl leading-relaxed">
            Find spacious 2 BHK flats and apartments in {localityName}. Chat directly with verified owners, schedule free physical visits, and save thousands in brokerage fees.
          </p>

          {/* Quick Locality Spec Pill Bar */}
          {localityInfo && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
              <div className="bg-stone-50 p-3.5 rounded-xl">
                <span className="text-xs text-stone-500 font-medium block">Avg. 2 BHK Rent</span>
                <span className="text-sm font-bold text-stone-900">{localityInfo.avgRent.bhk2}</span>
              </div>
              <div className="bg-stone-50 p-3.5 rounded-xl">
                <span className="text-xs text-stone-500 font-medium block">Metro & Rail Connectivity</span>
                <span className="text-sm font-bold text-stone-900 truncate block">{localityInfo.metroStation}</span>
              </div>
              <div className="bg-stone-50 p-3.5 rounded-xl">
                <span className="text-xs text-stone-500 font-medium block">Active 2 BHK Listings</span>
                <span className="text-sm font-bold text-purple-700">{totalCount} Available</span>
              </div>
            </div>
          )}
        </div>

        {/* Listings Section */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                Available 2 BHK Listings in {localityName}
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
              <h3 className="text-lg font-bold text-stone-800">No 2 BHK Flats currently listed in {localityName}</h3>
              <p className="text-sm text-stone-500 mt-2 mb-6">
                Explore 2 BHK flats in adjacent neighbourhoods or view all rental listings in {localityName}.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/mumbai/${params.locality}`}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  All Homes in {localityName}
                </Link>
                <Link
                  href="/mumbai"
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold px-5 py-2.5 rounded-xl transition"
                >
                  Explore Mumbai
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* FAQs Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 mb-14">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Frequently Asked Questions — 2 BHK in {localityName}
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

        {/* Sub-Category Navigation Bar */}
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 mb-14">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
            More Configurations in {localityName}
          </h3>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href={`/mumbai/${params.locality}/1-bhk-flats-for-rent`}
              className="bg-white hover:bg-purple-50 text-stone-700 hover:text-purple-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 transition"
            >
              1 BHK Flats in {localityName}
            </Link>
            <Link
              href={`/mumbai/${params.locality}/3-bhk-flats-for-rent`}
              className="bg-white hover:bg-purple-50 text-stone-700 hover:text-purple-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 transition"
            >
              3 BHK Flats in {localityName}
            </Link>
            <Link
              href={`/mumbai/${params.locality}/rooms-for-rent`}
              className="bg-white hover:bg-purple-50 text-stone-700 hover:text-purple-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 transition"
            >
              Rooms in {localityName}
            </Link>
            <Link
              href={`/mumbai/${params.locality}/pg`}
              className="bg-white hover:bg-purple-50 text-stone-700 hover:text-purple-700 text-xs font-semibold px-3.5 py-2 rounded-xl border border-stone-200 transition"
            >
              PGs in {localityName}
            </Link>
          </div>
        </div>

        <AppDownloadBanner />
      </div>
    </>
  );
}
