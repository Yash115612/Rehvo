'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  ArrowRight,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface FeaturedHomesProps {
  properties: PublicProperty[];
}

export const FeaturedHomes: React.FC<FeaturedHomesProps> = ({ properties }) => {
  const { isSaved, toggleSaveProperty } = useAuth();

  const residentialListings = properties.filter(
    (p) => p.category !== 'commercial' && p.type !== 'pg' && p.type !== 'room'
  );

  if (!residentialListings || residentialListings.length === 0) {
    return null;
  }

  const propA = residentialListings[0];
  const propB = residentialListings[1];
  const propC = residentialListings[2];

  return (
    <section className="bg-white py-12 sm:py-16 border-b border-stone-200/80">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0F766E]" />
                FEATURED HOMES
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Featured Homes
            </h2>
            <p className="text-sm font-medium text-stone-500 mt-1">
              Real homes available on REHVO with verified owners and verified marketplace.
            </p>
          </div>

          <Link
            href="/rent"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1 transition"
          >
            <span>View all properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Editorial Layout: Left Dominant Card (60%) + Right Stacked Cards (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT DOMINANT CARD (7 Cols on Desktop) */}
          {propA && (
            <div className="lg:col-span-7 group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 bg-stone-900">
              <RehvoImage
                src={propA.property_images?.[0]?.image_url}
                alt={propA.title}
                fill
                fallbackCategory="property"
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-10 pointer-events-none" />

              {/* Top Controls */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-20">
                <span className="bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full border border-white/20">
                  FEATURED
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSaveProperty(propA.id);
                  }}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-md ${
                    isSaved(propA.id)
                      ? 'bg-[#0F766E] text-white'
                      : 'bg-white/90 backdrop-blur-md text-stone-700 hover:bg-white hover:text-[#0F766E]'
                  }`}
                  aria-label="Save Property"
                >
                  <Heart className={`w-4 h-4 ${isSaved(propA.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Bottom Information */}
              <div className="relative z-20">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ₹{propA.price?.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-300 font-semibold">/month</span>
                  <span className="bg-[#CCFBF1]0/30 text-[#CCFBF1] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#0F766E]/40 ml-2">
                    Verified Listing
                  </span>
                </div>

                <Link
                  href={`/property/${propA.id}`}
                  className="text-lg sm:text-xl font-bold text-white hover:text-[#0F766E] transition line-clamp-1 mb-2 block"
                >
                  {propA.title}
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-stone-300 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{propA.locality || 'Mumbai'}, Mumbai</span>
                </div>

                <div className="flex items-center gap-5 pt-3 border-t border-white/15 text-xs font-bold text-stone-200">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-stone-300" />
                    <span>{propA.bedrooms || 2} BHK</span>
                  </div>
                  {propA.bathrooms && (
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-stone-300" />
                      <span>{propA.bathrooms} Baths</span>
                    </div>
                  )}
                  {(propA.carpet_area || propA.area) && (
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-stone-300" />
                      <span>{propA.carpet_area || propA.area} sq ft</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* RIGHT STACKED CARDS (5 Cols on Desktop) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {[propB, propC].filter(Boolean).map((prop) => (
              <div
                key={prop.id}
                className="group relative rounded-3xl overflow-hidden h-[210px] sm:h-[208px] flex flex-col justify-end p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200/80 bg-stone-900"
              >
                <RehvoImage
                  src={prop.property_images?.[0]?.image_url}
                  alt={prop.title}
                  fill
                  fallbackCategory="property"
                  sizes="(max-width: 1024px) 50vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 pointer-events-none" />

                {/* Top Save Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSaveProperty(prop.id);
                  }}
                  className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition z-20 ${
                    isSaved(prop.id)
                      ? 'bg-[#0F766E] text-white shadow-md'
                      : 'bg-white/90 backdrop-blur-md text-stone-700 hover:bg-white hover:text-[#0F766E]'
                  }`}
                  aria-label="Save Property"
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved(prop.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Bottom Details */}
                <div className="relative z-20">
                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className="text-lg font-black text-white">
                      ₹{prop.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-300 font-semibold">/mo</span>
                  </div>

                  <Link
                    href={`/property/${prop.id}`}
                    className="text-sm font-extrabold text-white hover:text-[#0F766E] transition line-clamp-1 block mb-1"
                  >
                    {prop.title}
                  </Link>

                  <div className="flex items-center justify-between text-xs text-stone-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0F766E]" />
                      <span className="truncate">{prop.locality || 'Mumbai'}</span>
                    </div>
                    <span className="font-bold">{prop.bedrooms || 2} BHK</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
