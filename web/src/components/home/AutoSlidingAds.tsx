'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface PromoSlide {
  id: string;
  badge: string;
  isSponsored?: boolean;
  title: string;
  location: string;
  price: string;
  period?: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  categoryTag: string;
}

const PROMO_SLIDES: PromoSlide[] = [
  {
    id: 'promo-1',
    badge: 'FEATURED RESIDENCE',
    isSponsored: false,
    title: '2 BHK Luxury Penthouse with Sea View',
    location: 'Pali Hill • Bandra West, Mumbai',
    price: '₹48,000',
    period: '/month',
    description: '100% verified residence with direct keys from landlord. Verified listing, fully furnished with private sundeck.',
    ctaText: 'View Property Details',
    ctaHref: '/rent',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&auto=format&fit=crop&q=80',
    categoryTag: 'RESIDENTIAL',
  },
  {
    id: 'promo-2',
    badge: 'SPONSORED WORKSPACE',
    isSponsored: true,
    title: 'Grade-A Corporate Office Suite',
    location: 'Bandra Kurla Complex (BKC), Mumbai',
    price: '₹95,000',
    period: '/month',
    description: 'High-efficiency corporate floor with 24/7 power backup, high-speed fiber, meeting rooms and LEED Gold certification.',
    ctaText: 'Explore Commercial Spaces',
    ctaHref: '/commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&auto=format&fit=crop&q=80',
    categoryTag: 'COMMERCIAL',
  },
  {
    id: 'promo-3',
    badge: 'FEATURED PG & CO-LIVING',
    isSponsored: false,
    title: 'Modern Managed Stay with Chef Meals',
    location: 'Hiranandani Gardens • Powai, Mumbai',
    price: '₹14,000',
    period: '/month',
    description: 'Daily chef-prepared meals, gigabit Wi-Fi, laundry & daily housekeeping. Zero deposit flexible terms for professionals.',
    ctaText: 'Explore PG & Rooms',
    ctaHref: '/pg-rooms',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1400&auto=format&fit=crop&q=80',
    categoryTag: 'CO-LIVING',
  },
  {
    id: 'promo-4',
    badge: 'COMMUNITY MATCH',
    isSponsored: false,
    title: 'Verified Roommates in High-Rise Flat',
    location: 'Lower Parel • Worli, Mumbai',
    price: '₹18,000',
    period: '/month',
    description: 'Connect directly with verified working professionals sharing modern 3 BHK flats near corporate offices.',
    ctaText: 'Browse Flatmates',
    ctaHref: '/flatmates',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&auto=format&fit=crop&q=80',
    categoryTag: 'FLATMATES',
  },
];

export const AutoSlidingAds: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % PROMO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + PROMO_SLIDES.length) % PROMO_SLIDES.length);
  }, []);

  // Autoplay with 5s interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      prevSlide();
    }
  };

  const slide = PROMO_SLIDES[currentSlide];

  return (
    <section
      className="py-6 sm:py-8 bg-white border-b border-stone-200/80 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative h-[340px] sm:h-[380px] lg:h-[400px] rounded-3xl sm:rounded-4xl overflow-hidden shadow-md border border-stone-200/80 bg-stone-950"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Image with smooth transition */}
          <div className="absolute inset-0 transition-opacity duration-700 ease-out">
            <RehvoImage
              key={slide.id}
              src={slide.image}
              alt={slide.title}
              fill
              fallbackCategory="property"
              className="object-cover scale-102 transition-transform duration-1000"
            />
            {/* Multi-layer gradient scrim for maximum readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          </div>

          {/* Foreground Slide Content */}
          <div className="relative h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-20 max-w-2xl">
            {/* Top Row Badges */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider ${
                  slide.isSponsored
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'bg-[#0F766E] text-white shadow-xs'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{slide.badge}</span>
              </span>

              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-1 rounded-full border border-white/20">
                VERIFIED LISTING
              </span>
            </div>

            {/* Middle & Bottom Headline Details */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-1.5 text-[#CCFBF1] text-xs sm:text-sm font-extrabold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{slide.location}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                {slide.title}
              </h2>

              <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-lg line-clamp-2 leading-relaxed">
                {slide.description}
              </p>

              {/* Price & Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-2xl sm:text-3xl font-black">{slide.price}</span>
                  <span className="text-xs sm:text-sm text-stone-300 font-semibold">{slide.period}</span>
                </div>

                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-black px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all group"
                >
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Left / Right Nav Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous promotional slide"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 sm:opacity-75 hover:opacity-100 z-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next promotional slide"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition opacity-0 group-hover:opacity-100 sm:opacity-75 hover:opacity-100 z-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 flex items-center gap-2 z-30">
            {PROMO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to promotional slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === idx
                    ? 'w-7 h-2.5 bg-[#0F766E]'
                    : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
