'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface RecommendedHomesProps {
  properties: PublicProperty[];
}

export const RecommendedHomes: React.FC<RecommendedHomesProps> = ({
  properties,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isSaved, toggleSaveProperty } = useAuth();

  const residentialListings = properties.filter(
    (p) => p.category !== 'commercial' && p.type !== 'pg' && p.type !== 'room'
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!residentialListings || residentialListings.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Carousel Navigation Arrows */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0F766E]" />
                CURATED INVENTORY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Recommended Homes
            </h2>
            <p className="text-sm font-medium text-stone-500 mt-1">
              Handpicked residential flats and apartments ready for immediate move-in.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-50 hover:border-stone-300 transition shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-700 flex items-center justify-center hover:bg-stone-50 hover:border-stone-300 transition shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Snapping Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {residentialListings.map((prop) => (
            <div
              key={prop.id}
              className="w-[280px] sm:w-[320px] flex-shrink-0 snap-start bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Image Area */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <RehvoImage
                    src={prop.property_images?.[0]?.image_url}
                    alt={prop.title}
                    fill
                    fallbackCategory="property"
                    sizes="320px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Verified Listing Badge */}
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full z-20">
                    Verified Listing
                  </div>

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSaveProperty(prop.id);
                    }}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm z-20 ${
                      isSaved(prop.id)
                        ? 'bg-[#0F766E] text-white'
                        : 'bg-white/90 backdrop-blur-md text-stone-700 hover:bg-white hover:text-[#0F766E]'
                    }`}
                    aria-label="Save Property"
                  >
                    <Heart className={`w-4 h-4 ${isSaved(prop.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-xl font-black text-stone-900">
                      ₹{prop.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-500 font-semibold">/month</span>
                  </div>

                  <Link
                    href={`/property/${prop.id}`}
                    className="text-base font-bold text-stone-900 group-hover:text-[#0F766E] transition line-clamp-1 block mb-2"
                  >
                    {prop.title}
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span className="truncate">{prop.locality || 'Mumbai'}, Mumbai</span>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-stone-100 text-xs font-bold text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-stone-400" />
                      <span>{prop.bedrooms || 2} BHK</span>
                    </div>
                    {prop.bathrooms && (
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-stone-400" />
                        <span>{prop.bathrooms} Baths</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Link */}
              <div className="px-5 pb-5 pt-0">
                <Link
                  href={`/property/${prop.id}`}
                  className="w-full py-2.5 rounded-xl bg-[#CCFBF1] hover:bg-[#0F766E] text-[#0F766E] hover:text-white font-bold text-xs flex items-center justify-center transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
