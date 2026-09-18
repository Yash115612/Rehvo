import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  MapPin,
  ShieldCheck,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { getPropertyBySlug } from '@/lib/seo/queries';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generatePropertySchema } from '@/lib/seo/schema';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { generatePropertySlug, getSafeImageUrl, slugify } from '@/lib/seo/slugs';
import { PropertyDownloadActions } from '@/components/property/PropertyDownloadActions';
import { PropertyInteractiveMap } from '@/components/maps/PropertyInteractiveMap';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export const revalidate = 60;

interface PropertyDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return { title: 'Property Not Found | REHVO' };
  }

  const fullSlug = generatePropertySlug(property);
  const canonicalUrl = `https://rehvo.in/property/${fullSlug}`;

  const title = `${property.bedrooms ? `${property.bedrooms} BHK ` : ''}${property.title} for Rent in ${property.locality}, ${property.city}`;
  const description = `Verified ${property.bedrooms ? `${property.bedrooms} BHK ` : ''}apartment for rent in ${property.locality}, ${property.city}. Monthly rent ₹${property.price?.toLocaleString('en-IN')}. 100% verified title deed, zero brokerage, instant visit booking on REHVO.`;

  return constructSeoMetadata({
    title,
    description,
    canonicalUrl,
    imageUrl: property.property_images?.[0]?.image_url,
    keywords: [
      `${property.title.toLowerCase()}`,
      `rent in ${property.locality.toLowerCase()}`,
      `${property.bedrooms} bhk in ${property.locality.toLowerCase()}`,
      `flats in ${property.locality.toLowerCase()}`,
      `direct owner rent ${property.city.toLowerCase()}`,
      `rehvo rentals`,
    ],
  });
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    notFound();
  }

  const cleanCity = slugify(property.city || 'mumbai');
  const cleanLocality = slugify(property.locality || 'andheri-west');
  const fullSlug = generatePropertySlug(property);
  const canonicalUrl = `https://rehvo.in/property/${fullSlug}`;

  const propertySchema = generatePropertySchema(property, canonicalUrl);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.price || 0);

  const formattedDeposit = property.deposit
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(property.deposit)
    : '2 Months Rent';

  const images = (property.property_images || []).map((img) =>
    getSafeImageUrl(typeof img === 'string' ? img : img?.image_url)
  );
  const coverImage = images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';

  const breadcrumbs = [
    { name: property.city || 'Mumbai', url: `/${cleanCity}` },
    { name: property.locality || 'Andheri West', url: `/${cleanCity}/${cleanLocality}` },
    { name: property.title, url: `/property/${fullSlug}` },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      {/* Schema.org RealEstateListing injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />

      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
                <ShieldCheck size={14} />
                <span>100% Verified Listing</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                <Clock size={14} />
                <span>Available Immediately</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-[#031B2A]">
              {property.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin size={15} className="text-[#0E8F73]" />
              <span>{property.locality}, {property.city}</span>
            </p>
          </div>

          {/* Pricing Header */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-right">
            <div className="text-2xl sm:text-3xl font-black text-[#031B2A]">
              {formattedPrice}
              <span className="text-xs font-normal text-slate-400">/month</span>
            </div>
            <p className="text-xs text-[#0E8F73] font-bold">Zero Brokerage Guaranteed</p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden border border-slate-200 bg-white p-2 shadow-xs">
          <div className="md:col-span-2 aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden relative">
            <Image
              src={coverImage}
              alt={`${property.title} living room in ${property.locality} ${property.city}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 66vw"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {images.slice(1, 3).map((imgUrl, idx) => (
              <div key={idx} className="aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden relative">
                <Image
                  src={imgUrl}
                  alt={`${property.title} bedroom view ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {images.length < 2 && (
              <div className="aspect-[16/10] bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400 font-semibold">
                More Photos on Mobile App
              </div>
            )}
          </div>
        </div>

        {/* Two-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Specs */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-center p-2 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Configuration</span>
                <p className="text-sm font-extrabold text-[#031B2A] mt-0.5">
                  {property.bedrooms ? `${property.bedrooms} BHK` : 'Studio'}
                </p>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bathrooms</span>
                <p className="text-sm font-extrabold text-[#031B2A] mt-0.5">
                  {property.bathrooms || 1} Bath
                </p>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Super Area</span>
                <p className="text-sm font-extrabold text-[#031B2A] mt-0.5">
                  {property.area ? `${property.area} sq.ft` : '650 sq.ft'}
                </p>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-50 col-span-3 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Security Deposit</span>
                <p className="text-sm font-extrabold text-[#0E8F73] mt-0.5">{formattedDeposit}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-base font-black text-[#031B2A]">Property Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description ||
                  `Spacious and well-ventilated apartment located in ${property.locality}, ${property.city}. Featuring 24/7 water supply, gated security, high-speed elevator access, and immediate connectivity to nearby metro stations and shopping high streets.`}
              </p>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="text-base font-black text-[#031B2A]">Amenities & Society Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(property.amenities && property.amenities.length > 0
                  ? property.amenities
                  : ['Gated Security', 'High Speed WiFi', 'Lift Access', 'Car Parking', 'Power Backup', 'Water Supply']
                ).map((amenity, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-700"
                  >
                    <CheckCircle2 size={14} className="text-[#0E8F73] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Location & Neighborhood Intelligence Map */}
            <PropertyInteractiveMap
              propertyTitle={property.title}
              locality={property.locality}
              city={property.city}
              latitude={property.latitude || 19.1363}
              longitude={property.longitude || 72.8277}
              address={property.address}
            />
          </div>

          {/* Right Action Drawer */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 sticky top-24">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#0E8F73] uppercase tracking-wider">Book Walkthrough</span>
                <h3 className="text-lg font-black text-[#031B2A]">Connect with Homeowner</h3>
                <p className="text-xs text-slate-500">
                  Direct physical visit with GPS check-in and instantaneous OTP verification.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1 text-xs">
                <div className="font-bold text-[#0E8F73] flex items-center gap-1.5">
                  <ShieldCheck size={14} />
                  <span>Title Deed Index-II Verified</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Government electricity bills and municipal ownership records confirmed.
                </p>
              </div>

              <PropertyDownloadActions
                propertyTitle={property.title}
                formattedPrice={formattedPrice}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Internal Linking Mesh */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity={cleanCity} currentLocality={cleanLocality} />
      </div>
    </div>
  );
}

