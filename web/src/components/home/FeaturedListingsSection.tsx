'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bed, Bath, Maximize2, MapPin, Heart, ShieldCheck, UserCheck } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyCard } from '@/components/public/PropertyCard';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface FeaturedListingsSectionProps {
  properties: PublicProperty[];
}

export const FeaturedListingsSection: React.FC<FeaturedListingsSectionProps> = ({
  properties,
}) => {
  const hasRealProperties = properties && properties.length > 0;

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#0F766E] block mb-1">
              FEATURED LISTINGS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#031B2A] tracking-tight">
              Handpicked properties for you
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
              100% verified listings from property owners and trusted middlemen.
            </p>
          </div>

          <Link
            href="/rent"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#031B2A] hover:text-[#0F766E] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>View all listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4-Card Responsive Grid or Live Empty State */}
        {hasRealProperties ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {properties.slice(0, 4).map((prop, idx) => (
              <PropertyCard key={prop.id} property={prop} priority={idx === 0} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[24px] p-8 sm:p-12 text-center border border-[#E2E8F0] shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#CCFBF1] flex items-center justify-center text-[#0F766E] mx-auto mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#031B2A]">
              Verified Marketplace Direct Listings in Mumbai
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto mt-2 leading-relaxed font-medium">
              List your residential apartment, room, PG, or commercial office directly on REHVO and connect with verified prospects instantly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/owner/properties/new"
                className="bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-sm"
              >
                + Post Free Property
              </Link>
              <Link
                href="/rent"
                className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#031B2A] text-xs font-bold px-6 py-3 rounded-xl transition"
              >
                Browse All Areas
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
