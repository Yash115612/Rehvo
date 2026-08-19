import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Zap,
  Check,
  Smartphone,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { getPropertyBySlug, getPublishedProperties } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generatePropertySchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { PropertyCard } from '@/components/public/PropertyCard';
import { PropertyActionButtons } from '@/components/public/PropertyActionButtons';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';
import { generatePropertySlug, normalizeLocalitySlug } from '@/lib/seo/slugs';

export const revalidate = 60;

interface PropertyDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return constructSeoMetadata({
      title: 'Property Not Found',
      description: 'The requested rental property is no longer active or available.',
      canonicalUrl: `https://rehvo.com/property/${params.slug}`,
      noIndex: true,
    });
  }

  const canonicalSlug = generatePropertySlug(property);
  const coverImage = property.property_images?.[0]?.image_url;

  return constructSeoMetadata({
    title: `${property.title} in ${property.locality}, ${property.city} | Zero Brokerage`,
    description: `Rent ${property.bedrooms} BHK ${property.type} in ${property.locality}, ${property.city} for ₹${property.price.toLocaleString('en-IN')}/month. Zero brokerage, verified pictures, direct owner chat on REHVO.`,
    canonicalUrl: `https://rehvo.com/property/${canonicalSlug}`,
    imageUrl: coverImage,
    type: 'article',
  });
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    notFound();
  }

  const canonicalSlug = generatePropertySlug(property);
  const canonicalUrl = `https://rehvo.com/property/${canonicalSlug}`;
  const localitySlug = normalizeLocalitySlug(property.locality);

  // Fetch similar nearby properties
  const { properties: similarProperties } = await getPublishedProperties({
    city: property.city,
    locality: property.locality,
    limit: 3,
  });
  const filteredSimilar = similarProperties.filter((p) => p.id !== property.id);

  const breadcrumbs = [
    { name: 'Mumbai', url: '/mumbai' },
    { name: property.locality, url: `/mumbai/${localitySlug}` },
    { name: property.title, url: `/property/${canonicalSlug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const propertySchema = generatePropertySchema(property, canonicalUrl);

  const DEFAULT_FALLBACK_COVER =
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';

  const images = (property.property_images || [])
    .filter((img) => img && typeof img.image_url === 'string' && img.image_url.startsWith('https://'))
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const mainImage = images[0]?.image_url || DEFAULT_FALLBACK_COVER;

  const furnishingLabel =
    property.furnishing === 'fully_furnished'
      ? 'Fully Furnished'
      : property.furnishing === 'semi_furnished'
      ? 'Semi-Furnished'
      : 'Unfurnished';

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={propertySchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Property Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mt-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Zero Brokerage
                </span>
                {property.verification_status === 'verified' && (
                  <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Property
                  </span>
                )}
                <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full capitalize">
                  {property.type} for rent
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                {property.title}
              </h1>

              <p className="text-sm text-stone-600 flex items-center gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span>
                  {property.address ? `${property.address}, ` : ''}
                  {property.locality}, {property.city}
                </span>
              </p>
            </div>

            {/* Price & Deposit Summary Block */}
            <div className="flex items-center gap-6 p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div>
                <span className="text-xs text-stone-500 font-medium block">Monthly Rent</span>
                <span className="text-3xl font-extrabold text-stone-900">
                  ₹{property.price.toLocaleString('en-IN')}
                </span>
                {property.maintenance > 0 ? (
                  <span className="text-[11px] text-stone-500 block">
                    + ₹{property.maintenance.toLocaleString('en-IN')} maint.
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-medium block">
                    Incl. Maintenance
                  </span>
                )}
              </div>

              <div className="h-12 w-[1px] bg-stone-200" />

              <div>
                <span className="text-xs text-stone-500 font-medium block">Security Deposit</span>
                <span className="text-xl font-bold text-stone-800">
                  ₹{(property.deposit || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-purple-600 font-bold block">0% Brokerage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden">
            {/* Primary Main Image */}
            <div className="relative aspect-[16/10] md:col-span-2 w-full bg-stone-100 min-h-[300px]">
              <Image
                src={mainImage}
                alt={`${property.title} living room view`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </div>

            {/* Secondary Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {images.slice(1, 3).map((img, idx) => (
                <div key={img.id || idx} className="relative aspect-[16/10] w-full bg-stone-100">
                  <Image
                    src={img.image_url}
                    alt={`${property.title} photo ${idx + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
              {images.length <= 1 && (
                <div className="relative aspect-[16/10] w-full bg-purple-50 flex items-center justify-center text-purple-400 font-bold text-xs p-4 text-center">
                  Verified REHVO Listing
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Details, Specs, Amenities, Description */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Specs Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h2 className="text-lg font-bold text-stone-900 mb-6">Property Highlights</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-stone-700">
                <div className="space-y-1">
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-purple-600" /> Configuration
                  </span>
                  <p className="text-base font-extrabold text-stone-900">{property.bedrooms} BHK</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-purple-600" /> Bathrooms
                  </span>
                  <p className="text-base font-extrabold text-stone-900">{property.bathrooms} Bath</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-purple-600" /> Super Area
                  </span>
                  <p className="text-base font-extrabold text-stone-900">
                    {property.area > 0 ? `${property.area} sq.ft` : 'Standard'}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-purple-600" /> Furnishing
                  </span>
                  <p className="text-base font-extrabold text-stone-900">{furnishingLabel}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-stone-900">About this Property</h2>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                {property.description ||
                  `This well-maintained ${property.bedrooms} BHK ${property.type} is situated in the prime residential locality of ${property.locality}, ${property.city}. The property offers convenient access to local markets, transit stations, and recreational hubs.`}
              </p>
            </div>

            {/* Amenities Checklist */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-stone-900">Amenities & Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-semibold text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-100"
                    >
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="capitalize">{amenity.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Live Direct Action Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-6">
              <div className="text-center pb-5 border-b border-stone-100">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2.5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-stone-900">Direct Owner Connection</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Zero Brokerage • Direct Inquiries & Tours
                </p>
              </div>

              {/* Interactive Actions (Schedule Visit, Chat, Enquire, Save, Share) */}
              <PropertyActionButtons property={property} />

              <div className="text-xs text-stone-500 space-y-2 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Zero Brokerage guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified physical inspection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Confirmed visit scheduling</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Nearby Properties */}
        {filteredSimilar.length > 0 && (
          <section className="my-16">
            <h2 className="text-2xl font-extrabold text-stone-900 mb-6">
              More Verified Properties in {property.locality}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSimilar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}

        <AppDownloadBanner propertyId={property.id} />
      </div>
    </>
  );
}
