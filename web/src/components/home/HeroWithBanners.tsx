'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Users,
  Briefcase,
  Home as HomeIcon,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import {
  ResidentialArchitectureIllustration,
  PgCoLivingIllustration,
  HostEarnBuildingIllustration,
  DamageProtectionShieldIllustration,
} from '@/components/illustrations/RehvoIllustrations';
import { cn } from '@/lib/cn';

interface HeroBanner {
  id: string;
  tag: string;
  tagColor: string;
  headline: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  badgeLabel: string;
  Illustration: React.FC<{ className?: string }>;
}

// 4 Professionally Art-Directed Promotional Banners in exact requested order:
// Slide 1 (active by default): Discover Your Perfect Home
// Slide 2: Find Your Perfect Living Space
// Slide 3: List Your Property for Free
// Slide 4: Rent with Confidence — REHVO Damage Protection
const HERO_BANNERS: HeroBanner[] = [
  {
    id: 'discover',
    tag: 'ZERO BROKERAGE RENTALS',
    tagColor: 'text-[#FED7AA] bg-[#F97316]/20 border-[#F97316]/40',
    headline: 'Discover Your',
    highlight: 'Perfect Home',
    subtitle: 'Direct homeowner flats, verified title deeds, digital agreements, and zero middleman commissions across India’s top cities.',
    ctaText: 'Explore Verified Homes',
    ctaHref: '/search?category=residential',
    secondaryCtaText: '0% Brokerage Guarantee',
    secondaryCtaHref: '/safety',
    badgeLabel: '100% DIRECT',
    Illustration: ResidentialArchitectureIllustration,
  },
  {
    id: 'coliving',
    tag: 'PG & CO-LIVING SPACES',
    tagColor: 'text-[#BAE6FD] bg-[#0284C7]/20 border-[#38BDF8]/40',
    headline: 'Find Your Perfect',
    highlight: 'Living Space',
    subtitle: 'Fully furnished private rooms, high-speed WiFi, daily meals, and zero-deposit options designed for young professionals and students.',
    ctaText: 'Explore PGs & Hostels',
    ctaHref: '/pg',
    secondaryCtaText: 'Zero Deposit Move-In',
    secondaryCtaHref: '/flatmates',
    badgeLabel: 'ZERO DEPOSIT',
    Illustration: PgCoLivingIllustration,
  },
  {
    id: 'owners',
    tag: 'FOR PROPERTY OWNERS',
    tagColor: 'text-[#BBF7D0] bg-[#059669]/20 border-[#10B981]/40',
    headline: 'List Your Property',
    highlight: 'For Free',
    subtitle: 'Connect with verified tenants, manage visits seamlessly, and secure digital rental agreements with zero commission.',
    ctaText: 'Post Property Free',
    ctaHref: '/list-property',
    secondaryCtaText: 'Owner Benefits',
    secondaryCtaHref: '/rent-receipts',
    badgeLabel: '100% FREE',
    Illustration: HostEarnBuildingIllustration,
  },
  {
    id: 'protection',
    tag: 'VERIFIED HANDOVER & DAMAGE PROTECTION',
    tagColor: 'text-[#FDE68A] bg-[#D97706]/20 border-[#FBBF24]/40',
    headline: 'Rent with Confidence.',
    highlight: 'Damage Protected.',
    subtitle: 'Room-by-room move-in condition baseline and dual-party acknowledgement to protect security deposits completely.',
    ctaText: 'How Protection Works',
    ctaHref: '/safety',
    secondaryCtaText: 'Inspection Process',
    secondaryCtaHref: '/safety#inspection',
    badgeLabel: 'VERIFIED BASELINE',
    Illustration: DamageProtectionShieldIllustration,
  },
];

const SEARCH_TABS = [
  { id: 'all', label: 'All Rentals', icon: Search },
  { id: 'residential', label: 'Apartments', icon: HomeIcon },
  { id: 'pg', label: 'PG & Co-Living', icon: Building },
  { id: 'flatmates', label: 'Flatmates', icon: Users },
  { id: 'commercial', label: 'Commercial', icon: Briefcase },
];

const POPULAR_LOCALITIES = ['Bandra West', 'Andheri West', 'Powai', 'Worli', 'BKC', 'Juhu'];

export function HeroWithBanners() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Search Controls State
  const [activeTab, setActiveTab] = useState('all');
  const [locality, setLocality] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Auto-slide effect (5.5-second interval, paused on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? HERO_BANNERS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % HERO_BANNERS.length);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'pg') {
      const p = new URLSearchParams();
      if (locality.trim()) p.set('locality', locality.trim());
      router.push(`/pg${p.toString() ? `?${p.toString()}` : ''}`);
      return;
    }
    if (activeTab === 'flatmates') {
      const p = new URLSearchParams();
      if (locality.trim()) p.set('locality', locality.trim());
      router.push(`/flatmates${p.toString() ? `?${p.toString()}` : ''}`);
      return;
    }
    if (activeTab === 'commercial') {
      const p = new URLSearchParams();
      p.set('category', 'commercial');
      if (locality.trim()) p.set('locality', locality.trim());
      if (maxPrice) p.set('maxPrice', maxPrice);
      router.push(`/search?${p.toString()}`);
      return;
    }

    const p = new URLSearchParams();
    if (activeTab === 'residential') p.set('category', 'residential');
    if (locality.trim()) p.set('locality', locality.trim());
    if (bedrooms) p.set('bedrooms', bedrooms);
    if (maxPrice) p.set('maxPrice', maxPrice);
    router.push(`/search?${p.toString()}`);
  };

  const handleQuickLocality = (loc: string) => {
    setLocality(loc);
    const p = new URLSearchParams();
    p.set('locality', loc);
    router.push(`/search?${p.toString()}`);
  };

  const currentBanner = HERO_BANNERS[activeIndex];
  const CurrentIllustration = currentBanner.Illustration;

  return (
    <div className="relative bg-gradient-to-b from-[#001741] from-50% to-[#F8FAFC] to-50%">
      {/* =====================================================================
          1. CURVED NAVY HERO BANNER STAGE (Controlled height & art-directed 2-sided layout)
         ===================================================================== */}
      <section
        className="relative overflow-hidden bg-[#001741] text-white rounded-b-[40px] sm:rounded-b-[56px] shadow-2xl transition-colors duration-500"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        aria-roledescription="carousel"
        aria-label="REHVO Promotional Banners"
      >
        {/* Architectural Ambient Background Glows */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#0284C7]/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-12 right-1/4 h-80 w-80 rounded-full bg-[#F97316]/12 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 right-10 h-64 w-64 rounded-full bg-[#10B981]/10 blur-3xl" />

        <Container size="wide" className="relative z-10 pt-6 pb-16 sm:pt-8 sm:pb-20 lg:pt-10 lg:pb-24">
          
          {/* Main 2-Sided Art-Directed Composition (Text ~45-50%, Artwork ~50-55%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-10 min-h-[380px] sm:min-h-[400px] lg:min-h-[420px]">
            
            {/* Left Content Column (Composed directly on Dark Navy — NO separate box/border) */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
              
              {/* Tag / Eyebrow Pill */}
              <div className="inline-flex items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] sm:text-xs font-bold tracking-wide uppercase',
                    currentBanner.tagColor
                  )}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {currentBanner.tag}
                </span>
              </div>

              {/* Bold Expressive Headline (Consistent min-height prevents height shift across slides) */}
              <h1 className="mt-3.5 text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.85rem] xl:text-[3.15rem] lg:leading-[1.12] text-white min-h-[4.5rem] sm:min-h-[5.5rem] lg:min-h-[7rem] flex items-center">
                <span>
                  {currentBanner.headline}{' '}
                  <span className="text-[#F97316] inline">{currentBanner.highlight}</span>
                </span>
              </h1>

              {/* Descriptive Subcopy (Consistent min-height prevents height shift across slides) */}
              <p className="mt-3.5 max-w-lg text-sm sm:text-base leading-relaxed text-slate-300 min-h-[3rem] sm:min-h-[3.25rem] lg:min-h-[3.5rem] flex items-center">
                {currentBanner.subtitle}
              </p>

              {/* Action Buttons Row */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={currentBanner.ctaHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform duration-150 hover:bg-[#EA580C] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                >
                  <span>{currentBanner.ctaText}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>

                <Link
                  href={currentBanner.secondaryCtaHref}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-white/10 active:scale-95"
                >
                  <ShieldCheck className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
                  <span>{currentBanner.secondaryCtaText}</span>
                </Link>
              </div>

              {/* Slide Controls: Dot Indicators & Prev/Next Arrows */}
              <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-4 max-w-md">
                {/* Dots with Slide Index numbers */}
                <div className="flex items-center gap-2">
                  {HERO_BANNERS.map((banner, idx) => (
                    <button
                      key={banner.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}: ${banner.headline}`}
                      className={cn(
                        'h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]',
                        activeIndex === idx ? 'w-8 bg-[#F97316]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                      )}
                    />
                  ))}
                  <span className="ml-2 text-xs font-bold text-slate-400">
                    0{activeIndex + 1} / 0{HERO_BANNERS.length}
                  </span>
                </div>

                {/* Arrows */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous banner"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next banner"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Large Architectural Artwork Column (Occupying ~50-55% width) */}
            <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-center relative">
              <div className="w-full max-w-[560px] lg:max-w-none transition-all duration-500 ease-out">
                <CurrentIllustration className="w-full h-auto drop-shadow-2xl" />
              </div>
            </div>

          </div>

        </Container>
      </section>

      {/* =====================================================================
          2. OVERLAPPING WHITE PILL SEARCH CONTROLS (Bridging Hero Bottom Edge)
         ===================================================================== */}
      <div className="relative -mt-10 sm:-mt-14 lg:-mt-16 z-30 pb-6">
        <Container size="wide">
          <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,23,65,0.18)] border border-slate-100 text-slate-800">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3.5 border-b border-slate-100 scrollbar-none" role="tablist">
              {SEARCH_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all select-none',
                      isSelected
                        ? 'bg-[#001741] text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#001741]'
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col gap-3.5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                
                {/* Locality Search Input */}
                <div className="sm:col-span-5 relative">
                  <label htmlFor="hero-search-locality" className="sr-only">
                    Locality or Landmark
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      id="hero-search-locality"
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="Search locality (e.g. Bandra, Powai)"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 text-sm font-semibold text-[#001741] placeholder:text-slate-400 focus:border-[#001741] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001741]/10"
                    />
                  </div>
                </div>

                {/* BHK Configuration Selector */}
                <div className={cn('sm:col-span-3', (activeTab === 'commercial' || activeTab === 'pg') && 'hidden sm:block sm:opacity-40 pointer-events-none')}>
                  <label htmlFor="hero-search-bedrooms" className="sr-only">
                    BHK Configuration
                  </label>
                  <select
                    id="hero-search-bedrooms"
                    aria-label="BHK Configuration"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    disabled={activeTab === 'commercial' || activeTab === 'pg'}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-[#001741] focus:border-[#001741] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001741]/10"
                  >
                    <option value="">Any BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>

                {/* Budget Range Selector */}
                <div className={cn('sm:col-span-4', (activeTab === 'commercial' || activeTab === 'pg') ? 'sm:col-span-7' : 'sm:col-span-4')}>
                  <label htmlFor="hero-search-budget" className="sr-only">
                    Max Monthly Rent
                  </label>
                  <select
                    id="hero-search-budget"
                    aria-label="Max Monthly Rent"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm font-semibold text-[#001741] focus:border-[#001741] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#001741]/10"
                  >
                    <option value="">Any Budget</option>
                    <option value="20000">Up to ₹20,000</option>
                    <option value="35000">Up to ₹35,000</option>
                    <option value="50000">Up to ₹50,000</option>
                    <option value="75000">Up to ₹75,000</option>
                    <option value="100000">Up to ₹1,00,000</option>
                    <option value="150000">Up to ₹1,50,000+</option>
                  </select>
                </div>
              </div>

              {/* Quick Popular Localities & Submit Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Popular:</span>
                  {POPULAR_LOCALITIES.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => handleQuickLocality(loc)}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 transition-colors hover:bg-orange-50 hover:text-[#F97316]"
                    >
                      {loc}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F97316] px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#EA580C] hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  <span>Search Rentals</span>
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
}
