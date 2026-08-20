'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ChevronRight,
  Heart,
  CheckCircle2,
  MapPin,
  Sparkles,
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
  const router = useRouter();
  const { user, isSaved, toggleSaveProperty } = useAuth();
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleSaveClick = async (e: React.MouseEvent, property: PublicProperty) => {
    e.preventDefault();
    e.stopPropagation();

    const slug = generatePropertySlug(property);
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/property/${slug}`)}`);
      return;
    }

    if (savingId === property.id) return;
    setSavingId(property.id);
    try {
      await toggleSaveProperty(property.id);
    } finally {
      setSavingId(null);
    }
  };

  if (!properties || properties.length === 0) {
    return (
      <section className="bg-[#F8F7F4] py-20 sm:py-28 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-200/80 max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">New verified homes coming online</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Explore all active listings across Mumbai or list your own property with zero brokerage.
            </p>
            <Link
              href="/mumbai"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-black text-white font-extrabold text-xs px-6 py-3 rounded-2xl transition shadow-md"
            >
              <span>Explore All Listings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const primary = properties[0];
  const secondary = properties.slice(1, 3);
  const wideProperty = properties[3] || null;
  const remaining = properties.slice(4, 7);

  return (
    <section className="bg-[#F8F7F4] py-20 sm:py-28 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                Featured Homes
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              Places worth seeing
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
              Curated zero-brokerage residences and rooms verified directly with property owners.
            </p>
          </div>

          <Link
            href="/mumbai"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
          >
            <span>View all {totalCount > 0 ? `${totalCount} verified homes` : 'homes'}</span>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Magazine-Style Composition: Property A (Large) + Property B & C (Stacked) */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* PROPERTY A: LARGE DOMINANT FEATURED CARD (Left 7 Cols) */}
            {primary && (
              <article className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-2xl hover:border-purple-200 transition-all duration-300 flex flex-col group relative">
                <Link
                  href={`/property/${generatePropertySlug(primary)}`}
                  className="block relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[16/11] w-full bg-stone-100 overflow-hidden"
                >
                  <Image
                    src={getSafeImageUrl(primary.property_images?.[0]?.image_url, 0)}
                    alt={primary.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent pointer-events-none" />

                  {/* Badges Over Image */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                    <span className="bg-stone-900/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                      Featured Residence
                    </span>
                    <span className="bg-purple-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-sm">
                      0% Brokerage
                    </span>
                    {primary.verification_status === 'verified' && (
                      <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Host
                      </span>
                    )}
                  </div>

                  {/* Clean Floating Save Button */}
                  <button
                    type="button"
                    onClick={(e) => handleSaveClick(e, primary)}
                    aria-label={isSaved(primary.id) ? 'Saved' : 'Save listing'}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md ${
                      isSaved(primary.id)
                        ? 'bg-rose-500 text-white scale-105'
                        : 'bg-stone-900/40 text-white hover:bg-white hover:text-rose-500 hover:scale-105'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved(primary.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Overlay Metadata over Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 block">
                      {primary.locality} • Mumbai
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mt-0.5 group-hover:text-purple-200 transition">
                      {primary.title}
                    </h3>
                  </div>
                </Link>

                {/* Primary Card Details */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                        ₹{primary.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-500 font-semibold">/ month</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-stone-600 bg-stone-100/80 px-3.5 py-1.5 rounded-full border border-stone-200/60 w-fit">
                      <span>{primary.bedrooms} BHK</span>
                      <span>•</span>
                      <span>{primary.bathrooms} Baths</span>
                      <span>•</span>
                      <span>{primary.area} sq.ft</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-500 leading-relaxed line-clamp-2">
                    {primary.description ||
                      'Well-ventilated residence featuring generous daylight, high-spec fittings, and direct neighborhood transit links.'}
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                      {primary.furnishing.replace('_', ' ')} • Available Direct
                    </span>

                    <Link
                      href={`/property/${generatePropertySlug(primary)}`}
                      className="text-xs font-extrabold text-purple-600 hover:text-purple-800 flex items-center gap-1 group/btn"
                    >
                      <span>Explore home</span>
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* PROPERTY B & C: TWO COMPACT STACKED LISTINGS (Right 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {secondary.map((prop, idx) => (
                <article
                  key={prop.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col sm:flex-row flex-1 group relative"
                >
                  <Link
                    href={`/property/${generatePropertySlug(prop)}`}
                    className="relative aspect-[16/10] sm:aspect-square sm:w-52 bg-stone-100 flex-shrink-0 overflow-hidden block"
                  >
                    <Image
                      src={getSafeImageUrl(prop.property_images?.[0]?.image_url, idx + 1)}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 220px"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

                    <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {prop.bedrooms} BHK
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleSaveClick(e, prop)}
                      aria-label={isSaved(prop.id) ? 'Saved' : 'Save listing'}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md ${
                        isSaved(prop.id)
                          ? 'bg-rose-500 text-white scale-105'
                          : 'bg-stone-900/40 text-white hover:bg-white hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved(prop.id) ? 'fill-current' : ''}`} />
                    </button>
                  </Link>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest">
                          {prop.locality}
                        </span>
                        {prop.verification_status === 'verified' && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-extrabold text-stone-900 group-hover:text-purple-700 transition leading-tight mt-1 line-clamp-1">
                        <Link href={`/property/${generatePropertySlug(prop)}`}>{prop.title}</Link>
                      </h4>

                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-xl font-extrabold text-stone-900 tracking-tight">
                          ₹{prop.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-stone-500 font-semibold">/mo</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                      <span>
                        {prop.furnishing.replace('_', ' ')} • {prop.area} sq.ft
                      </span>
                      <Link
                        href={`/property/${generatePropertySlug(prop)}`}
                        className="text-purple-600 font-extrabold group-hover:translate-x-1 transition-transform flex items-center gap-0.5"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* PROPERTY D: ONE WIDE PANORAMIC PROPERTY BLOCK BELOW */}
          {wideProperty && (
            <article className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group relative">
              <Link
                href={`/property/${generatePropertySlug(wideProperty)}`}
                className="lg:col-span-6 relative aspect-[16/9] lg:aspect-auto min-h-[260px] bg-stone-100 overflow-hidden block"
              >
                <Image
                  src={getSafeImageUrl(wideProperty.property_images?.[0]?.image_url, 3)}
                  alt={wideProperty.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-stone-900/90 text-white text-[9px] font-extrabold uppercase px-3 py-1.5 rounded-full backdrop-blur-md">
                    Featured Choice
                  </span>
                  <span className="bg-purple-600 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full">
                    0% Brokerage
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleSaveClick(e, wideProperty)}
                  aria-label={isSaved(wideProperty.id) ? 'Saved' : 'Save listing'}
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md ${
                    isSaved(wideProperty.id)
                      ? 'bg-rose-500 text-white scale-105'
                      : 'bg-stone-900/40 text-white hover:bg-white hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved(wideProperty.id) ? 'fill-current' : ''}`} />
                </button>
              </Link>

              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest">
                      {wideProperty.locality} • Mumbai
                    </span>
                    {wideProperty.verification_status === 'verified' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Listing
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 group-hover:text-purple-700 transition leading-tight">
                    <Link href={`/property/${generatePropertySlug(wideProperty)}`}>
                      {wideProperty.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
                    {wideProperty.description ||
                      'Spacious layout with high ceiling, modern kitchen fittings, 24/7 security, and dedicated parking.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-stone-900 tracking-tight">
                      ₹{wideProperty.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">/ month</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full">
                      {wideProperty.bedrooms} BHK • {wideProperty.bathrooms} Baths • {wideProperty.area} sq.ft
                    </span>

                    <Link
                      href={`/property/${generatePropertySlug(wideProperty)}`}
                      className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      Explore →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Tertiary Row if additional listings exist */}
          {remaining.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              {remaining.map((prop, idx) => (
                <article
                  key={prop.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col group relative"
                >
                  <Link
                    href={`/property/${generatePropertySlug(prop)}`}
                    className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden block"
                  >
                    <Image
                      src={getSafeImageUrl(prop.property_images?.[0]?.image_url, idx + 4)}
                      alt={prop.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

                    <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {prop.bedrooms} BHK
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleSaveClick(e, prop)}
                      aria-label={isSaved(prop.id) ? 'Saved' : 'Save listing'}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-md ${
                        isSaved(prop.id)
                          ? 'bg-rose-500 text-white scale-105'
                          : 'bg-stone-900/40 text-white hover:bg-white hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isSaved(prop.id) ? 'fill-current' : ''}`} />
                    </button>
                  </Link>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-widest block">
                        {prop.locality}
                      </span>
                      <h4 className="text-sm font-extrabold text-stone-900 group-hover:text-purple-700 transition leading-tight mt-1 line-clamp-1">
                        <Link href={`/property/${generatePropertySlug(prop)}`}>{prop.title}</Link>
                      </h4>
                      <div className="flex items-baseline gap-1 mt-1.5">
                        <span className="text-lg font-extrabold text-stone-900">
                          ₹{prop.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-400 font-semibold">/mo</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-semibold">
                      <span>{prop.furnishing.replace('_', ' ')}</span>
                      <Link
                        href={`/property/${generatePropertySlug(prop)}`}
                        className="text-purple-600 font-extrabold flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
