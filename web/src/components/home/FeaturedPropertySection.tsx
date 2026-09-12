'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, ArrowRight, Sparkles, ShieldCheck, CheckCircle2, CalendarCheck } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';
import { useAuth } from '@/lib/auth/AuthContext';
import { PublicProperty } from '@/lib/seo/types';

interface FeaturedPropertySectionProps {
  property?: PublicProperty | null;
}

export const FeaturedPropertySection: React.FC<FeaturedPropertySectionProps> = ({ property }) => {
  const { savedPropertyIds, toggleSaveProperty } = useAuth();

  // Fallback high-impact featured property if no database property is provided
  const featuredId = property?.id || 'featured-worli-sea-face';
  const isSaved = savedPropertyIds.includes(featuredId);

  const title = property?.title || '3 BHK High-Floor Sea View Penthouse in Worli';
  const rent = property?.price || 65000;
  const locality = property?.locality || 'Worli Sea Face, Mumbai';
  const bhk = property?.bedrooms ? `${property.bedrooms} BHK` : property?.type ? `${property.type} Flat` : '3 BHK Penthouse';
  const area = property?.area ? `${property.area} sq ft` : '1,450 sq ft';
  const furnishing = property?.furnishing ? property.furnishing.replace('_', ' ') : 'Fully Furnished';
  const coverImage =
    property?.property_images?.find((img) => img.is_cover)?.image_url ||
    property?.property_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&auto=format&fit=crop&q=80';

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-stone-200/80">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                PROPERTY OF THE MOMENT
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Featured Property
            </h2>
            <p className="text-sm font-medium text-stone-600 mt-1 max-w-xl">
              Handpicked verified residence with panoramic skyline views, verified direct landlord & verified marketplace.
            </p>
          </div>

          <Link
            href="/rent"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#0F766E] hover:text-[#064E3B] group"
          >
            <span>View All Featured Homes</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Large Editorial Showcase Card */}
        <div className="bg-white rounded-3xl sm:rounded-4xl border border-stone-200/90 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 group">
          {/* Left / Top Large Hero Image (Takes 7 cols) */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] w-full bg-stone-950 overflow-hidden">
            <RehvoImage
              src={coverImage}
              alt={title}
              fill
              fallbackCategory="property"
              className="object-cover group-hover:scale-103 transition-transform duration-700 opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
              <span className="bg-stone-900/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full border border-white/20">
                VERIFIED RESIDENCE
              </span>
              <span className="bg-[#0F766E] text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs">
                VERIFIED LISTING
              </span>
            </div>

            {/* Save Heart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleSaveProperty(featuredId);
              }}
              aria-label={isSaved ? 'Unsave property' : 'Save property'}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition shadow-md z-20 ${
                isSaved
                  ? 'bg-white text-rose-500 fill-rose-500'
                  : 'bg-black/50 backdrop-blur-md text-white hover:text-rose-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Bottom Image Caption */}
            <div className="absolute bottom-4 left-4 right-4 z-20 text-white flex items-center justify-between">
              <span className="text-xs font-bold text-stone-200 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg">
                Exclusive Direct Landlord Listing
              </span>
              <span className="text-xs font-bold text-stone-200 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg">
                1 / 8 High-Res Photos
              </span>
            </div>
          </div>

          {/* Right Editorial Story & Action Specs (Takes 5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#0F766E] text-xs font-black uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{locality}</span>
                </div>
                <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Keys
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-900 leading-snug">
                {title}
              </h3>

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-3xl sm:text-4xl font-black text-stone-900">
                  ₹{rent.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-stone-500">/ month</span>
                <span className="text-xs font-bold text-emerald-600 ml-2">Verified Listing</span>
              </div>

              {/* 3 Spec Badges */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Configuration</span>
                  <span className="text-xs font-black text-stone-900">{bhk}</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Carpet Area</span>
                  <span className="text-xs font-black text-stone-900">{area}</span>
                </div>
                <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Furnishing</span>
                  <span className="text-xs font-black text-stone-900 capitalize truncate block">{furnishing}</span>
                </div>
              </div>

              {/* Verified Host Strip */}
              <div className="bg-[#CCFBF1]/70 rounded-2xl p-3.5 border border-[#99F6E4]/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white font-black text-sm flex items-center justify-center shadow-xs">
                    S
                  </div>
                  <div>
                    <span className="text-xs font-black text-stone-900 block leading-tight">Sunil Mehta</span>
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Direct Owner • Fast Response (Under 10 mins)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/property/${featuredId}`}
                className="w-full sm:flex-1 py-3.5 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition group"
              >
                <span>View Property Details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/property/${featuredId}`}
                className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 transition"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Schedule Visit</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
