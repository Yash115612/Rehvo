'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Wallet,
  CheckCircle2,
} from 'lucide-react';

import {
  HERO_ADS,
  HeroAdItem,
  useHeroTheme,
} from '@/components/v10/HeroThemeContext';

export { HERO_ADS };
export type { HeroAdItem };

const LOCALITIES = [
  'Bandra West, Mumbai',
  'Andheri West, Mumbai',
  'Powai, Mumbai',
  'Worli & Lower Parel, Mumbai',
  'BKC, Mumbai',
  'Juhu, Mumbai',
  'Thane West, Mumbai',
];

const TRENDING_QUICK_LOCALITIES = [
  'Bandra West',
  'Andheri West',
  'Powai',
  'BKC',
  'Worli',
];

const ROTATING_PLACEHOLDERS = [
  'Search for "2 BHK in Bandra West, PG..."',
  'Search for "Furnished Flat in Powai, Verified Owner/Broker..."',
  'Search for "Single Room in Andheri West..."',
  'Search for "Office Space in BKC..."',
];

export const HeroSearch: React.FC = () => {
  const router = useRouter();
  const {
    activeAdIndex,
    currentAd,
    setActiveAdIndex,
    nextAd,
    prevAd,
    setIsPaused,
  } = useHeroTheme();

  const [selectedLocality, setSelectedLocality] = useState('Bandra West, Mumbai');
  const [locationOpen, setLocationOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [localitySearchFilter, setLocalitySearchFilter] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Smooth rotating search placeholder ticker every 3.2s
  useEffect(() => {
    if (query) return;
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [query]);

  // Close locality dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handlePrevAd = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      prevAd();
    },
    [prevAd]
  );

  const handleNextAd = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      nextAd();
    },
    [nextAd]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('locality', query.trim());
    else params.set('locality', selectedLocality.split(',')[0].trim());
    router.push(`/search?${params.toString()}`);
  };

  const handleQuickLocality = (loc: string) => {
    setSelectedLocality(`${loc}, Mumbai`);
    const params = new URLSearchParams();
    params.set('locality', loc);
    router.push(`/search?${params.toString()}`);
  };

  const filteredLocalities = LOCALITIES.filter((loc) =>
    loc.toLowerCase().includes(localitySearchFilter.toLowerCase().trim())
  );

  return (
    <section className="relative w-full overflow-hidden -mt-[68px] bg-white">
      {/* =====================================================================
          1. UNIFIED HEADER + HERO AD STAGE (ZOOMCAR REFERENCE / APP MIRROR)
          Direct translation of unifiedHeroHeaderContainer from mobile app
         ===================================================================== */}
      <div
        className="w-full border-b border-[#E2ECEF] transition-colors duration-700 ease-in-out pb-8 sm:pb-10 pt-[78px] sm:pt-[86px] rounded-b-[32px] sm:rounded-b-[44px] relative overflow-hidden"
        style={{ backgroundColor: currentAd.bgGradient }}
      >
        {/* Subtle Ambient Radial Glow (Extends seamlessly behind floating Header) */}
        <div
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[380px] rounded-full blur-[110px] opacity-35 pointer-events-none transition-colors duration-700"
          style={{ backgroundColor: currentAd.superColor }}
        />

        {/* Soft luxury vertical gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/30 pointer-events-none" />

        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          
          {/* Top Search & Action Icons Row (Exact topHeaderRow from Mobile App) */}
          <div className="max-w-3xl mx-auto flex items-center gap-2.5 sm:gap-3">
            {/* Search Pill Input (headerSearchPill) */}
            <form
              onSubmit={handleSearch}
              className="flex-1 bg-white/95 backdrop-blur-md rounded-full pl-4 pr-1.5 py-1.5 border-[1.5px] border-white/95 shadow-[0_4px_20px_rgba(3,27,42,0.08)] hover:shadow-[0_8px_30px_rgba(3,27,42,0.12)] focus-within:shadow-[0_8px_30px_rgba(15,118,110,0.18)] focus-within:border-[#0F766E]/50 transition-all duration-300 flex items-center gap-2.5 sm:gap-3 group"
            >
              <Search className="w-4 h-4 text-[#64748B] group-focus-within:text-[#0F766E] shrink-0 stroke-[2.4] transition-colors" />
              
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] placeholder:text-[#64748B] placeholder:transition-opacity placeholder:duration-300 focus:outline-none truncate py-1"
                />
              </div>

              {/* Single Search Button */}
              <button
                type="submit"
                className="h-10 px-5 sm:px-6 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            {/* Right Action Icons: AI, Saved & Wallet (Exact topRightActions from Mobile App) */}
            <div className="flex items-center gap-2 shrink-0">
              {/* REHVO AI Assistant Icon Button */}
              <Link
                href="/ai-concierge"
                title="REHVO AI Concierge"
                className="w-11 h-11 rounded-full bg-[#CCFBF1] hover:bg-[#0F766E] text-[#0F766E] hover:text-white border-[1.5px] border-white/95 shadow-[0_4px_14px_rgba(3,27,42,0.08)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 stroke-[2.4]" />
              </Link>

              {/* Saved Items Icon Button */}
              <Link
                href="/search?saved=true"
                title="Saved Properties"
                className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#031B2A] hover:text-[#EF4444] border-[1.5px] border-white/95 shadow-[0_4px_14px_rgba(3,27,42,0.08)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer"
              >
                <Heart className="w-4 h-4 stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-[#EF4444] text-white text-[9px] font-black flex items-center justify-center px-1 border-2 border-white">
                  0
                </span>
              </Link>

              {/* Wallet Hub Icon Button */}
              <Link
                href="/download"
                title="Wallet & R-Cash Rewards"
                className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#0F766E] border-[1.5px] border-white/95 shadow-[0_4px_14px_rgba(3,27,42,0.08)] flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative cursor-pointer"
              >
                <Wallet className="w-4 h-4 stroke-[2.4]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white" />
              </Link>
            </div>
          </div>

          {/* Locality Dropdown Row & Trending Chips (localitySelectorRow) */}
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-2 pt-0.5">
            {/* Locality Selector Capsule */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLocationOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/95 shadow-xs text-xs font-bold text-[#031B2A] hover:bg-white hover:shadow-sm transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <MapPin className="w-3.5 h-3.5 text-[#0F766E] stroke-[2.6]" />
                <span className="truncate max-w-[160px]">{selectedLocality}</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#64748B] transition-transform duration-200 ${
                    locationOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {locationOpen && (
                <div className="absolute left-0 top-11 w-64 bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-2.5 pb-2">
                    Select Locality in Mumbai
                  </div>
                  
                  {/* Filter input */}
                  <input
                    type="text"
                    value={localitySearchFilter}
                    onChange={(e) => setLocalitySearchFilter(e.target.value)}
                    placeholder="Filter area..."
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs text-[#031B2A] font-semibold mb-2 focus:outline-none focus:border-[#0F766E]"
                    autoFocus
                  />

                  <div className="max-h-56 overflow-y-auto space-y-0.5 no-scrollbar">
                    {filteredLocalities.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocality(loc);
                          setLocationOpen(false);
                          setLocalitySearchFilter('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-[#F1F5F9] transition cursor-pointer ${
                          selectedLocality === loc ? 'text-[#0F766E] bg-[#CCFBF1]/50' : 'text-[#031B2A]'
                        }`}
                      >
                        <span className="truncate">{loc}</span>
                        {selectedLocality === loc && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Micro Locality Chips */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#64748B]">Popular:</span>
              {TRENDING_QUICK_LOCALITIES.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => handleQuickLocality(loc)}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/75 hover:bg-white text-[#64748B] hover:text-[#0F766E] border border-white/85 transition shadow-2xs cursor-pointer"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Ad Banner (V4HeroAdBanner — Exact Center-Aligned Style from media_1788617637489) */}
          <div
            className="relative group pt-4 sm:pt-6 pb-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Desktop Left / Right Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrevAd}
              aria-label="Previous promotional slide"
              className="hidden md:flex absolute left-4 lg:left-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-white shadow-md items-center justify-center text-[#031B2A] hover:text-[#0F766E] opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleNextAd}
              aria-label="Next promotional slide"
              className="hidden md:flex absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-white shadow-md items-center justify-center text-[#031B2A] hover:text-[#0F766E] opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <Link
              href={currentAd.route}
              className="block text-center cursor-pointer transition-transform duration-300"
            >
              {/* Dynamic Animated Content Container */}
              <div key={currentAd.id} className="animate-in fade-in zoom-in-95 duration-500">
                {/* Super Tag */}
                <div
                  className="text-[11px] sm:text-xs font-black tracking-[1.6px] uppercase mb-1.5 transition-colors duration-500 flex items-center justify-center gap-1.5"
                  style={{ color: currentAd.superColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentAd.superColor }} />
                  <span>{currentAd.superTag}</span>
                </div>

                {/* Massive Stylized Headline */}
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-black text-[#031B2A] tracking-tight leading-none my-1">
                  {currentAd.title}
                </div>

                {/* Subtitle */}
                <div className="text-xs sm:text-sm md:text-base font-extrabold text-[#64748B] tracking-[2px] uppercase mt-2 mb-3.5">
                  {currentAd.titleSub}
                </div>

                {/* Feature Pill */}
                <div
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4 shadow-xs transition-colors duration-500 hover:scale-105"
                  style={{ backgroundColor: currentAd.pillBg, color: currentAd.pillColor }}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{currentAd.pillText}</span>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {HERO_ADS.map((_, idx) => {
                  const isActive = idx === activeAdIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveAdIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive ? 'w-6' : 'w-2 bg-[#CBD5E1] hover:bg-slate-400'
                      }`}
                      style={{ backgroundColor: isActive ? currentAd.superColor : undefined }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
};
