'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ArrowRight,
  Bed,
  Bath,
  Maximize2,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';
import { useAuth } from '@/lib/auth/AuthContext';

interface PropertyShowcaseProps {
  properties: PublicProperty[];
  totalCount: number;
}

export const PropertyShowcase: React.FC<PropertyShowcaseProps> = ({
  properties,
  totalCount,
}) => {
  const { user, isSaved, toggleSaveProperty } = useAuth();

  if (!properties || properties.length === 0) {
    return null;
  }

  // Split into Magazine Editorial Grid
  const propA = properties[0]; // Large Dominant Card
  const propB = properties[1]; // Stacked Top Right
  const propC = properties[2]; // Stacked Bottom Right
  const propD = properties[3]; // Wide Panoramic Below
  const restProps = properties.slice(4, 7); // Supplementary Row

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleToggleSave = async (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login?redirect=/saved';
      return;
    }
    await toggleSaveProperty(propertyId);
  };

  return (
    <section className="bg-[#F8F7F4] py-20 sm:py-28 border-b border-stone-200/90 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                Selected Residences
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              Homes worth discovering
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
              Curated verified residences in high-demand Mumbai neighborhoods with 100% zero brokerage fees.
            </p>
          </div>

          <Link
            href="/mumbai"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
          >
            <span>Explore all {totalCount || properties.length} homes</span>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Magazine Editorial Spread Layout */}
        <div className="space-y-6">
          {/* Top Row: Property A (Large Dominant, ~60%) + Properties B & C (Stacked, ~40%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* PROPERTY A: Large Dominant Residence (7 Cols on Desktop) */}
            {propA && (
              <Link
                href={`/property/${generatePropertySlug(propA)}`}
                className="lg:col-span-7 group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden bg-stone-100">
                  <Image
                    src={getSafeImageUrl(propA.property_images?.[0]?.image_url, 0)}
                    alt={propA.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-white/10 shadow-sm">
                      Featured Residence
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, propA.id)}
                      className={`p-2.5 rounded-xl backdrop-blur-md transition pointer-events-auto shadow-md ${
                        isSaved(propA.id)
                          ? 'bg-red-500 text-white shadow-red-500/30'
                          : 'bg-white/85 text-stone-700 hover:bg-white hover:text-red-500'
                      }`}
                      aria-label="Save Property"
                    >
                      <Heart className={`w-4 h-4 ${isSaved(propA.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Image Lower Caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
                      {propA.locality} • Mumbai
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                      {propA.title}
                    </h3>
                  </div>
                </div>

                {/* Card Details Footer */}
                <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs text-stone-600 font-bold">
                    {propA.bedrooms && (
                      <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl">
                        <Bed className="w-3.5 h-3.5 text-purple-600" />
                        <span>{propA.bedrooms} {propA.bedrooms.includes('BHK') ? '' : 'BHK'}</span>
                      </span>
                    )}
                    {propA.bathrooms && (
                      <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl">
                        <Bath className="w-3.5 h-3.5 text-purple-600" />
                        <span>{propA.bathrooms} Baths</span>
                      </span>
                    )}
                    {propA.area && (
                      <span className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl">
                        <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>{propA.area} sq.ft</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base sm:text-xl font-extrabold text-stone-900 block leading-tight">
                        {formatPrice(propA.price)}
                        <span className="text-xs font-semibold text-stone-500">/mo</span>
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-600 uppercase">
                        0% Brokerage
                      </span>
                    </div>

                    <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* PROPERTIES B & C: Vertically Stacked Pair (5 Cols on Desktop) */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              {[propB, propC].filter(Boolean).map((prop, idx) => (
                <Link
                  key={prop.id}
                  href={`/property/${generatePropertySlug(prop)}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-stretch flex-1"
                >
                  <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-stone-100">
                    <Image
                      src={getSafeImageUrl(prop.property_images?.[0]?.image_url, idx + 1)}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, prop.id)}
                      className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition shadow-sm ${
                        isSaved(prop.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/85 text-stone-700 hover:bg-white hover:text-red-500'
                      }`}
                      aria-label="Save Property"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved(prop.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block">
                        {prop.locality}
                      </span>
                      <h4 className="text-base font-extrabold text-stone-900 leading-tight group-hover:text-purple-600 transition">
                        {prop.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div>
                        <span className="text-sm font-extrabold text-stone-900 block leading-tight">
                          {formatPrice(prop.price)}
                          <span className="text-[11px] font-normal text-stone-500">/mo</span>
                        </span>
                        <span className="text-[9px] font-extrabold text-emerald-600 uppercase">
                          Zero Fee
                        </span>
                      </div>

                      <span className="text-xs font-extrabold text-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Row: Property D (Wide Panoramic Feature Unit) */}
          {propD && (
            <Link
              href={`/property/${generatePropertySlug(propD)}`}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 grid grid-cols-1 md:grid-cols-12 items-stretch"
            >
              <div className="md:col-span-7 relative aspect-[16/9] md:aspect-auto min-h-[260px] overflow-hidden bg-stone-100">
                <Image
                  src={getSafeImageUrl(propD.property_images?.[0]?.image_url, 3)}
                  alt={propD.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-white/10">
                    Panoramic Living
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                    {propD.locality} • Mumbai
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight group-hover:text-purple-600 transition">
                    {propD.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2">
                    {propD.description || 'Modern verified residence with high ventilation and quick transit access.'}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 text-xs font-bold text-stone-600">
                    {propD.bedrooms && (
                      <span className="bg-stone-100 px-2.5 py-1 rounded-lg">
                        {propD.bedrooms}
                      </span>
                    )}
                    {propD.furnishing && (
                      <span className="bg-stone-100 px-2.5 py-1 rounded-lg capitalize">
                        {propD.furnishing.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-extrabold text-stone-900 block leading-tight">
                      {formatPrice(propD.price)}
                      <span className="text-xs font-normal text-stone-500">/mo</span>
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase">
                      Zero Brokerage
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl group-hover:bg-purple-600 transition">
                    <span>View Home</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Tertiary Row: Supplementary 3-Card Grid if more properties available */}
          {restProps.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {restProps.map((prop, idx) => (
                <Link
                  key={prop.id}
                  href={`/property/${generatePropertySlug(prop)}`}
                  className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <Image
                      src={getSafeImageUrl(prop.property_images?.[0]?.image_url, idx + 4)}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, prop.id)}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition shadow-sm ${
                        isSaved(prop.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/85 text-stone-700 hover:bg-white hover:text-red-500'
                      }`}
                      aria-label="Save Property"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved(prop.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 block">
                      {prop.locality}
                    </span>
                    <h4 className="text-base font-extrabold text-stone-900 leading-tight group-hover:text-purple-600 transition">
                      {prop.title}
                    </h4>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-stone-900">
                        {formatPrice(prop.price)}
                        <span className="text-[11px] font-normal text-stone-500">/mo</span>
                      </span>

                      <span className="text-xs font-bold text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
