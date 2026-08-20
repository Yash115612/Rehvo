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
  ShieldCheck,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';
import { useAuth } from '@/lib/auth/AuthContext';

interface FeaturedHomesProps {
  properties: PublicProperty[];
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ properties }) => {
  const { user, isSaved, toggleSaveProperty } = useAuth();

  if (!properties || properties.length === 0) {
    return null;
  }

  const propA = properties[0];
  const propB = properties[1];
  const propC = properties[2];

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
    <section className="bg-[#FAF8F5] py-16 sm:py-24 border-b border-stone-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#FF5533] uppercase tracking-wider block">
              FEATURED HOMES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Places worth seeing
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Handpicked homes you&apos;ll love.
            </p>
          </div>

          <Link
            href="/mumbai"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF5533] hover:text-[#EE4422] transition"
          >
            <span>View all properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Editorial Layout: Left Dominant Card (60%) + Right Stacked Cards (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT DOMINANT CARD (7 Cols on Desktop) */}
          {propA && (
            <Link
              href={`/property/${generatePropertySlug(propA)}`}
              className="lg:col-span-7 group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200/80 bg-stone-900"
            >
              <Image
                src={getSafeImageUrl(propA.property_images?.[0]?.image_url, 0)}
                alt={propA.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />

              {/* Top Controls */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <span className="bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                  FEATURED
                </span>

                <button
                  type="button"
                  onClick={(e) => handleToggleSave(e, propA.id)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition pointer-events-auto shadow-md ${
                    isSaved(propA.id)
                      ? 'bg-[#FF5533] text-white'
                      : 'bg-white/90 text-stone-700 hover:bg-white hover:text-[#FF5533]'
                  }`}
                  aria-label="Save Property"
                >
                  <Heart className={`w-4 h-4 ${isSaved(propA.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Bottom Details Overlay */}
              <div className="relative z-10 space-y-1.5 text-white">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    ₹{propA.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-300 font-medium">/mo</span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {propA.bedrooms ? `${propA.bedrooms} Flat · ` : ''}{propA.locality}
                </h3>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-stone-300 font-bold">
                  {propA.bedrooms && (
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-[#FF5533]" />
                      <span>{propA.bedrooms}</span>
                    </span>
                  )}
                  {propA.bathrooms && (
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-[#FF5533]" />
                      <span>{propA.bathrooms} Bath</span>
                    </span>
                  )}
                  {propA.area && (
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-[#FF5533]" />
                      <span>{propA.area} sq ft</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* RIGHT STACKED PAIR (5 Cols on Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {[propB, propC].filter(Boolean).map((prop, idx) => (
              <Link
                key={prop.id}
                href={`/property/${generatePropertySlug(prop)}`}
                className="group relative rounded-3xl overflow-hidden min-h-[190px] sm:min-h-[218px] flex flex-col justify-end p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 bg-stone-900 flex-1"
              >
                <Image
                  src={getSafeImageUrl(prop.property_images?.[0]?.image_url, idx + 1)}
                  alt={prop.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />

                {/* Top Save Button */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(e, prop.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition shadow-md ${
                    isSaved(prop.id)
                      ? 'bg-[#FF5533] text-white'
                      : 'bg-white/90 text-stone-700 hover:bg-white hover:text-[#FF5533]'
                  }`}
                  aria-label="Save Property"
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved(prop.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Details Overlay */}
                <div className="relative z-10 space-y-0.5 text-white">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-white">
                      ₹{prop.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-300 font-medium">/mo</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                    {prop.bedrooms ? `${prop.bedrooms} Flat · ` : ''}{prop.locality}
                  </h4>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-300 font-semibold">
                    {prop.bedrooms && <span>{prop.bedrooms}</span>}
                    {prop.bathrooms && <span>· {prop.bathrooms} Bath</span>}
                    {prop.area && <span>· {prop.area} sq ft</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
