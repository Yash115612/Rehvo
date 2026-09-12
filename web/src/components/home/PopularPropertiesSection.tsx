'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, ArrowRight, Flame } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';
import { useAuth } from '@/lib/auth/AuthContext';
import { PublicProperty } from '@/lib/seo/types';

interface PopularPropertiesSectionProps {
  properties: PublicProperty[];
}

export const PopularPropertiesSection: React.FC<PopularPropertiesSectionProps> = ({ properties }) => {
  const { savedPropertyIds, toggleSaveProperty } = useAuth();
  // Display up to 6 properties starting after the first 3 if available, or first 6
  const displayProperties = properties.length > 3 ? properties.slice(2, 8) : properties.slice(0, 6);

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-stone-200/80">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                TRENDING IN MUMBAI
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Popular Properties
            </h2>
            <p className="text-sm font-medium text-stone-600 mt-1 max-w-xl">
              Places people are exploring right now with verified owners & brokers and verified marketplace.
            </p>
          </div>

          <Link
            href="/rent"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0F766E] hover:text-[#064E3B] group"
          >
            <span>Browse All Trending</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((property) => {
            const isSaved = savedPropertyIds.includes(property.id);
            const coverImage =
              property.property_images?.find((img) => img.is_cover)?.image_url ||
              property.property_images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80';

            const bhkText = property.bedrooms ? `${property.bedrooms} BHK` : property.type ? `${property.type} Flat` : '2 BHK';
            const areaText = property.area ? `${property.area} sq ft` : '850 sq ft';
            const furnishingText = property.furnishing ? property.furnishing.replace('_', ' ') : 'Furnished';

            return (
              <div
                key={property.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-[#5EEAD4] hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                {/* Photo Header */}
                <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
                  <RehvoImage
                    src={coverImage}
                    alt={property.title}
                    fill
                    fallbackCategory="property"
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-stone-900/90 backdrop-blur-xs text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                      VERIFIED
                    </span>
                    <span className="bg-[#0F766E] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                      VERIFIED LISTING
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSaveProperty(property.id);
                    }}
                    aria-label={isSaved ? 'Unsave property' : 'Save property'}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
                      isSaved
                        ? 'bg-rose-50 text-rose-500 fill-rose-500'
                        : 'bg-white/90 text-stone-700 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-stone-950/85 backdrop-blur-xs text-white flex items-baseline gap-1">
                    <span className="text-base font-black">₹{property.price?.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-stone-300 font-semibold">/mo</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-[#0F766E] text-xs font-black uppercase tracking-wider mb-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{property.locality ? `${property.locality}, Mumbai` : 'Mumbai'}</span>
                    </div>

                    <h3 className="text-base font-extrabold text-stone-900 group-hover:text-[#0F766E] transition line-clamp-1">
                      {property.title}
                    </h3>
                  </div>

                  {/* Spec Row */}
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-semibold pt-2 border-t border-stone-100">
                    <span>{bhkText}</span>
                    <span>•</span>
                    <span>{areaText}</span>
                    <span>•</span>
                    <span className="capitalize">{furnishingText}</span>
                  </div>

                  {/* View Details Link */}
                  <Link
                    href={`/property/${property.id}`}
                    className="mt-2 w-full py-2.5 rounded-xl bg-stone-50 group-hover:bg-[#0F766E] text-stone-900 group-hover:text-white font-extrabold text-xs flex items-center justify-center gap-1.5 border border-stone-200/90 group-hover:border-[#0F766E] transition shadow-2xs"
                  >
                    <span>View Property</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
