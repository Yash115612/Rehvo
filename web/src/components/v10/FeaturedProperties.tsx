'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyCard } from './PropertyCard';

interface FeaturedPropertiesProps {
  properties: PublicProperty[];
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({ properties }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black tracking-widest text-[#0F766E] uppercase bg-[#CCFBF1] px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3 h-3 text-[#0F766E]" />
              <span>HANDPICKED BY REHVO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
              Featured Verified Homes
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium">
              Physical walkthrough verified homes with 100% zero agent commission.
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Carousel Controls */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#031B2A] transition shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#031B2A] transition shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <Link
              href="/search"
              className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#CCFBF1]/50 hover:bg-[#CCFBF1] transition ml-auto sm:ml-0"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Desktop Horizontal Scroll Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {properties.map((property) => (
            <div
              key={property.id}
              className="w-[82vw] max-w-[320px] sm:w-[350px] shrink-0 snap-start"
            >
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
