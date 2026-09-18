'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowUpDown,
  Home,
  Building,
  ShieldCheck,
  Map as MapIcon,
  Grid,
  X,
  Mic,
  RotateCcw,
  Check,
  ChevronDown,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Flame,
  Award,
  Navigation,
  Loader2,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyCard } from '@/components/v10/PropertyCard';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { VERIFIED_MUMBAI_FALLBACKS } from '@/lib/seo/fallbackProperties';
import { detectCurrentBrowserLocation } from '@/services/locationService';

interface SearchPageClientProps {
  initialProperties: PublicProperty[];
  serverTotalCount: number;
  initialParams: {
    locality?: string;
    category?: 'residential' | 'commercial' | 'all';
    type?: string;
    bedrooms?: string;
    maxPrice?: string;
    sort?: string;
  };
}

const BHK_OPTIONS = ['All', '1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

const BUDGET_RANGES = [
  { label: 'All Budgets', min: 0, max: 1000000 },
  { label: 'Under ₹35k', min: 0, max: 35000 },
  { label: '₹35k - ₹60k', min: 35000, max: 60000 },
  { label: '₹60k - ₹1.0L', min: 60000, max: 100000 },
  { label: '₹1.0L+', min: 100000, max: 1000000 },
];

const QUICK_AI_PICKS = [
  { label: '2BHK in Bandra West', locality: 'Bandra West', bhk: '2', maxPrice: 85000 },
  { label: 'Flats Under ₹40k', maxPrice: 40000 },
  { label: 'Near BKC Metro', locality: 'BKC', nearMetro: true },
  { label: 'Zero Deposit Homes', zeroDeposit: true },
  { label: 'Bachelor Friendly', tenantPref: 'bachelors' },
  { label: 'Luxury Apartments', minPrice: 80000 },
];

const AMENITY_OPTIONS = [
  { id: 'lift', label: 'Elevator / Lift' },
  { id: 'parking', label: 'Covered Parking' },
  { id: 'power_backup', label: '100% Power Backup' },
  { id: 'gym', label: 'Gymnasium' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'security', label: '24x7 Security & CCTV' },
  { id: 'balcony', label: 'Private Balcony' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
];

export const SearchPageClient: React.FC<SearchPageClientProps> = ({
  initialProperties,
  serverTotalCount,
  initialParams,
}) => {
  const router = useRouter();

  // Combine server properties with verified fallbacks so search is always populated
  const allProperties = useMemo(() => {
    if (initialProperties && initialProperties.length > 0) {
      return initialProperties;
    }
    return VERIFIED_MUMBAI_FALLBACKS;
  }, [initialProperties]);

  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState(initialParams.locality || '');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'residential' | 'commercial'>(
    initialParams.category === 'commercial' ? 'commercial' : initialParams.category === 'residential' ? 'residential' : 'all'
  );
  const [selectedBhk, setSelectedBhk] = useState<string>(
    initialParams.bedrooms ? `${initialParams.bedrooms} BHK` : 'All'
  );
  const [selectedPriceIdx, setSelectedPriceIdx] = useState<number>(
    initialParams.maxPrice ? (parseInt(initialParams.maxPrice, 10) <= 40000 ? 1 : 2) : 0
  );
  const [priceRange, setPriceRange] = useState<number>(
    initialParams.maxPrice ? parseInt(initialParams.maxPrice, 10) : 150000
  );
  const [selectedFurnishing, setSelectedFurnishing] = useState<string>('all');
  const [nearMetroOnly, setNearMetroOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState<boolean>(false);
  const [highAiMatchOnly, setHighAiMatchOnly] = useState<boolean>(false);
  const [zeroDepositOnly, setZeroDepositOnly] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedTenantPref, setSelectedTenantPref] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // 2. Toolbar & View State
  const [sortBy, setSortBy] = useState<string>(initialParams.sort || 'newest');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [selectedMapPropId, setSelectedMapPropId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleDetectLocation = async () => {
    setIsLocating(true);
    const result = await detectCurrentBrowserLocation();
    setIsLocating(false);
    if (result.success) {
      setSearchQuery(result.locality);
    }
  };

  // Filter application count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedBhk !== 'All') count++;
    if (selectedPriceIdx !== 0 || priceRange < 150000) count++;
    if (selectedFurnishing !== 'all') count++;
    if (nearMetroOnly) count++;
    if (petFriendlyOnly) count++;
    if (highAiMatchOnly) count++;
    if (zeroDepositOnly) count++;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (selectedTenantPref !== 'all') count++;
    if (selectedAvailability !== 'all') count++;
    return count;
  }, [
    selectedCategory,
    selectedBhk,
    selectedPriceIdx,
    priceRange,
    selectedFurnishing,
    nearMetroOnly,
    petFriendlyOnly,
    highAiMatchOnly,
    zeroDepositOnly,
    selectedAmenities,
    selectedTenantPref,
    selectedAvailability,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBhk('All');
    setSelectedPriceIdx(0);
    setPriceRange(150000);
    setSelectedFurnishing('all');
    setNearMetroOnly(false);
    setVerifiedOnly(true);
    setVerifiedOnly(true);
    setPetFriendlyOnly(false);
    setHighAiMatchOnly(false);
    setZeroDepositOnly(false);
    setSelectedAmenities([]);
    setSelectedTenantPref('all');
    setSelectedAvailability('all');
  };

  // 3. Computed Filtered Properties
  const filteredProperties = useMemo(() => {
    return allProperties
      .filter((prop) => {
        // Text search (locality, title, address, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchLocality = prop.locality?.toLowerCase().includes(q);
          const matchTitle = prop.title?.toLowerCase().includes(q);
          const matchAddress = prop.address?.toLowerCase().includes(q);
          const matchCity = prop.city?.toLowerCase().includes(q);
          if (!matchLocality && !matchTitle && !matchAddress && !matchCity) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (prop.category && prop.category !== selectedCategory) return false;
        }

        // BHK filter
        if (selectedBhk !== 'All') {
          const reqNum = selectedBhk.split(' ')[0];
          if (selectedBhk.includes('1 RK')) {
            if (prop.type !== 'room' && prop.type !== 'studio') return false;
          } else if (selectedBhk.includes('4+')) {
            if (!prop.bedrooms || parseInt(prop.bedrooms, 10) < 4) return false;
          } else {
            if (prop.bedrooms && !prop.bedrooms.includes(reqNum)) return false;
          }
        }

        // Budget / Price Range
        if (selectedPriceIdx !== 0) {
          const range = BUDGET_RANGES[selectedPriceIdx];
          if (prop.price < range.min || prop.price > range.max) return false;
        } else if (priceRange < 150000) {
          if (prop.price > priceRange) return false;
        }

        // Furnishing
        if (selectedFurnishing !== 'all') {
          if (prop.furnishing !== selectedFurnishing) return false;
        }

        // Near Metro (< 800m)
        if (nearMetroOnly) {
          const metroDist = (prop as any).metroDistance || '';
          if (!metroDist.includes('m to') && !prop.amenities?.includes('near_metro')) {
            return false;
          }
        }

        // Pet Friendly
        if (petFriendlyOnly) {
          if (!prop.amenities?.includes('pet_friendly')) return false;
        }

        // High AI Match (95%+)
        if (highAiMatchOnly) {
          const score = (prop as any).aiMatchScore || 95;
          if (score < 95) return false;
        }

        // Zero Deposit
        if (zeroDepositOnly) {
          const isZd = prop.deposit === 0 || (prop as any).isZeroDeposit === true;
          if (!isZd) return false;
        }

        // Amenities checklist
        if (selectedAmenities.length > 0) {
          const propAmenities = prop.amenities || [];
          const hasAll = selectedAmenities.every((amenity) => propAmenities.includes(amenity));
          if (!hasAll) return false;
        }

        // Tenant preferences
        if (selectedTenantPref !== 'all') {
          const prefs = prop.tenant_preferences || [];
          if (!prefs.includes(selectedTenantPref) && !prefs.includes('any')) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'ai_match') {
          const scoreA = (a as any).aiMatchScore || 95;
          const scoreB = (b as any).aiMatchScore || 95;
          return scoreB - scoreA;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    allProperties,
    searchQuery,
    selectedCategory,
    selectedBhk,
    selectedPriceIdx,
    priceRange,
    selectedFurnishing,
    nearMetroOnly,
    petFriendlyOnly,
    highAiMatchOnly,
    zeroDepositOnly,
    selectedAmenities,
    selectedTenantPref,
    sortBy,
  ]);

  // Handle Quick AI Pick click
  const handleQuickPick = (pick: (typeof QUICK_AI_PICKS)[0]) => {
    if (pick.locality) setSearchQuery(pick.locality);
    if (pick.bhk) setSelectedBhk(`${pick.bhk} BHK`);
    if (pick.maxPrice) setPriceRange(pick.maxPrice);
    if (pick.nearMetro) setNearMetroOnly(true);
    if (pick.zeroDeposit) setZeroDepositOnly(true);
    if (pick.tenantPref) setSelectedTenantPref(pick.tenantPref);
    if (pick.minPrice) setPriceRange(pick.minPrice + 50000);
  };

  // Toggle single amenity in checklist
  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // First property for map view preview
  const activeMapProperty = useMemo(() => {
    if (selectedMapPropId) {
      const found = filteredProperties.find((p) => p.id === selectedMapPropId);
      if (found) return found;
    }
    return filteredProperties[0] || null;
  }, [selectedMapPropId, filteredProperties]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* =====================================================================
          FIX 1 & 2: COMPACT SEARCH HEADER (NO GIANT LOGO, HOME / SEARCH BREADCRUMB)
         ===================================================================== */}
      <div className="border-b border-[#E2E8F0] bg-white/60 backdrop-blur-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <Breadcrumb
            items={[
              { name: 'Mumbai', url: '/search' },
              { name: searchQuery ? searchQuery : 'All Verified Rentals', url: '/search' },
            ]}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                <h1 className="text-xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
                  {searchQuery ? `Verified Rentals in ${searchQuery}` : 'All Verified Rentals in Mumbai'}
                </h1>
                <span className="bg-[#CCFBF1] text-[#064E3B] text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-2xs">
                  {filteredProperties.length} Homes Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
                Verified listings • Owner & broker contact • Verified physically with scheduled doorstep visits
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        
        {/* =====================================================================
            FIX 3: APP STYLE STICKY GLASS SEARCH BAR (LOC, SEARCH, VOICE AI, AI CONCIERGE)
           ===================================================================== */}
        <div className="sticky top-[60px] sm:top-[74px] z-30 mb-4 transition-all">
          <div className="bg-white/95 backdrop-blur-md rounded-full pl-3 sm:pl-4 pr-1 sm:pr-1.5 py-1 sm:py-1.5 border-[1.5px] border-white/95 shadow-[0_4px_24px_rgba(3,27,42,0.08)] hover:shadow-[0_8px_32px_rgba(3,27,42,0.12)] focus-within:border-[#0F766E]/50 focus-within:shadow-[0_8px_32px_rgba(15,118,110,0.18)] transition-all flex items-center gap-1.5 sm:gap-2.5">
            <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#0F766E] shrink-0 stroke-[2.4]" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search locality or landmark (e.g. Bandra West, BKC)...'
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] placeholder:text-[#64748B] focus:outline-none truncate py-1"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 cursor-pointer text-xs"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}

            {/* Use Current Location Button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              title="Use Current Location (GPS)"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-50 hover:bg-[#0F766E] text-[#0F766E] hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs group"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-spin" />
              ) : (
                <Navigation className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-current group-hover:fill-white" />
              )}
            </button>

            {/* Voice AI Button */}
            <button
              type="button"
              onClick={() => setVoiceModalOpen(true)}
              title="Voice AI Search"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F1F5F9] hover:bg-[#CCFBF1] text-[#031B2A] hover:text-[#0F766E] flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs"
            >
              <Mic className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>

            {/* AI Concierge Shortcut Button */}
            <Link
              href="/ai-concierge"
              title="AI Property Concierge"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#CCFBF1] hover:bg-[#0F766E] text-[#0F766E] hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </Link>

            {/* Emerald Search Button */}
            <button
              type="button"
              className="h-8 sm:h-10 px-3 sm:px-6 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-[11px] sm:text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition shrink-0 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            FIX 4: FILTER BAR V2 (PREMIUM CHIPS WITH HORIZONTAL SCROLL)
           ===================================================================== */}
        <div className="mb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-0.5">
            {/* BHK Dropdown / Chips */}
            {['All', '1 BHK', '2 BHK', '3 BHK'].map((bhk) => {
              const active = selectedBhk === bhk;
              return (
                <button
                  key={bhk}
                  type="button"
                  onClick={() => setSelectedBhk(bhk)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border ${
                    active
                      ? 'bg-[#0F766E] text-white border-[#0F766E]'
                      : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0] hover:bg-slate-50'
                  }`}
                >
                  {bhk}
                </button>
              );
            })}

            {/* Quick Price Range Chip Cycle */}
            <button
              type="button"
              onClick={() => setSelectedPriceIdx((prev) => (prev + 1) % BUDGET_RANGES.length)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border flex items-center gap-1.5 ${
                selectedPriceIdx !== 0
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span>{BUDGET_RANGES[selectedPriceIdx].label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Property Category Chips */}
            <button
              type="button"
              onClick={() =>
                setSelectedCategory((prev) =>
                  prev === 'residential' ? 'all' : 'residential'
                )
              }
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border ${
                selectedCategory === 'residential'
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              Residential
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedCategory((prev) =>
                  prev === 'commercial' ? 'all' : 'commercial'
                )
              }
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border ${
                selectedCategory === 'commercial'
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              Commercial
            </button>

            {/* Near Metro (< 800m) Toggle */}
            <button
              type="button"
              onClick={() => setNearMetroOnly((prev) => !prev)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border flex items-center gap-1.5 ${
                nearMetroOnly
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0] hover:bg-slate-50'
              }`}
            >
              <span>🚆 Near Metro</span>
              {nearMetroOnly && <Check className="w-3 h-3" />}
            </button>

            {/* Verified Marketplace Chip */}
            <button
              type="button"
              onClick={() => setVerifiedOnly((prev) => !prev)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border flex items-center gap-1.5 ${
                verifiedOnly
                  ? 'bg-[#CCFBF1] text-[#064E3B] border-[#0F766E]/40 font-extrabold'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0]'
              }`}
            >
              <span>✨ Verified Listing</span>
              {verifiedOnly && <Check className="w-3 h-3 text-[#0F766E]" />}
            </button>

            {/* Zero Deposit Chip */}
            <button
              type="button"
              onClick={() => setZeroDepositOnly((prev) => !prev)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border flex items-center gap-1.5 ${
                zeroDepositOnly
                  ? 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]/40 font-extrabold'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0]'
              }`}
            >
              <span>⚡ 0 Deposit</span>
              {zeroDepositOnly && <Check className="w-3 h-3 text-[#D97706]" />}
            </button>

            {/* Pet Friendly */}
            <button
              type="button"
              onClick={() => setPetFriendlyOnly((prev) => !prev)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border flex items-center gap-1.5 ${
                petFriendlyOnly
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0]'
              }`}
            >
              <span>🐾 Pet Friendly</span>
              {petFriendlyOnly && <Check className="w-3 h-3" />}
            </button>

            {/* High AI Match */}
            <button
              type="button"
              onClick={() => setHighAiMatchOnly((prev) => !prev)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-2xs cursor-pointer border flex items-center gap-1.5 ${
                highAiMatchOnly
                  ? 'bg-[#0F766E] text-white border-[#0F766E]'
                  : 'bg-white text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0]'
              }`}
            >
              <span>⚡ AI Match 95%+</span>
              {highAiMatchOnly && <Check className="w-3 h-3" />}
            </button>

            {/* More Filters Toggle */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black transition shadow-2xs cursor-pointer border bg-white hover:bg-slate-50 text-[#031B2A] border-[#E2E8F0] flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>More Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#0F766E] text-white text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =====================================================================
            FIX 8: QUICK AI PICKS STRIP
           ===================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 pt-0.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3" />
            <span>AI Quick Picks:</span>
          </span>
          {QUICK_AI_PICKS.map((pick) => (
            <button
              key={pick.label}
              type="button"
              onClick={() => handleQuickPick(pick)}
              className="shrink-0 px-3 py-1 rounded-full bg-white hover:bg-[#CCFBF1] text-[#334155] hover:text-[#064E3B] text-[11px] font-bold border border-[#E2E8F0] hover:border-[#0F766E]/40 transition shadow-2xs cursor-pointer"
            >
              {pick.label}
            </button>
          ))}
        </div>

        {/* =====================================================================
            RESULTS TOOLBAR: COUNT, MAP TOGGLE (FIX 9), & SORT DROPDOWN
           ===================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 pt-2 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-xs sm:text-sm font-black text-[#031B2A]">
              Showing {filteredProperties.length} Properties
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-[#EF4444] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            {/* FIX 9: MAP TOGGLE (LIST VIEW | MAP VIEW SEGMENTED CONTROL) */}
            <div className="inline-flex p-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs transition cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#0F766E] font-black shadow-xs'
                    : 'text-[#64748B] hover:text-[#031B2A] font-bold'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs transition cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-[#0F766E] font-black shadow-xs'
                    : 'text-[#64748B] hover:text-[#031B2A] font-bold'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-8 sm:h-9 pl-2.5 sm:pl-3 pr-7 sm:pr-8 rounded-full bg-white border border-[#E2E8F0] text-[11px] sm:text-xs font-bold text-[#031B2A] shadow-2xs focus:outline-none focus:border-[#0F766E] cursor-pointer appearance-none"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="ai_match">Highest AI Match</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-[#64748B] absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* =====================================================================
            FIX 5: SEARCH RESULTS LAYOUT (DESKTOP 2-COLUMN WITH LEFT SIDEBAR)
           ===================================================================== */}
        <div className="flex items-start gap-8">
          
          {/* 5A. LEFT SIDEBAR (ADVANCED FILTERS) */}
          <aside className="w-[300px] shrink-0 hidden lg:block sticky top-[135px]">
            <div className="bg-white rounded-[24px] p-5 border border-[#E2E8F0] shadow-xs space-y-5 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0F766E]" />
                  <span className="text-sm font-black text-[#031B2A]">Filters</span>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* 1. Budget Range Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#031B2A]">Max Monthly Rent</span>
                  <span className="font-black text-[#0F766E]">
                    {priceRange >= 150000 ? '₹1,50,000+' : `₹${priceRange.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={150000}
                  step={5000}
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(parseInt(e.target.value, 10));
                    setSelectedPriceIdx(0);
                  }}
                  className="w-full accent-[#0F766E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-[#64748B]">
                  <span>₹15k</span>
                  <span>₹75k</span>
                  <span>₹1.5L+</span>
                </div>
              </div>

              {/* 2. BHK Configuration */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs font-extrabold text-[#031B2A] block">BHK Layout</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {BHK_OPTIONS.map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setSelectedBhk(bhk)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition cursor-pointer border ${
                        selectedBhk === bhk
                          ? 'bg-[#0F766E] text-white border-[#0F766E]'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0]'
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Security Deposit Filter */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs font-extrabold text-[#031B2A] block">Security Deposit</span>
                <div className="space-y-1.5 text-xs font-medium">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deposit"
                      checked={!zeroDepositOnly}
                      onChange={() => setZeroDepositOnly(false)}
                      className="accent-[#0F766E]"
                    />
                    <span className="text-[#334155]">Any Deposit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deposit"
                      checked={zeroDepositOnly}
                      onChange={() => setZeroDepositOnly(true)}
                      className="accent-[#0F766E]"
                    />
                    <span className="text-[#334155] font-bold">⚡ Zero Deposit Pass Only</span>
                  </label>
                </div>
              </div>

              {/* 4. Furnishing Status */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs font-extrabold text-[#031B2A] block">Furnishing</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'fully_furnished', label: 'Furnished' },
                    { id: 'semi_furnished', label: 'Semi-Furnished' },
                    { id: 'unfurnished', label: 'Unfurnished' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFurnishing(f.id)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition cursor-pointer border ${
                        selectedFurnishing === f.id
                          ? 'bg-[#0F766E] text-white border-[#0F766E]'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Key Amenities Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs font-extrabold text-[#031B2A] block">Amenities</span>
                <div className="space-y-1.5">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const checked = selectedAmenities.includes(amenity.id);
                    return (
                      <label
                        key={amenity.id}
                        className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer hover:text-[#0F766E] transition"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAmenity(amenity.id)}
                          className="w-4 h-4 rounded accent-[#0F766E] cursor-pointer"
                        />
                        <span className={checked ? 'font-bold text-[#0F766E]' : ''}>
                          {amenity.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 6. Tenant Preference */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                <span className="text-xs font-extrabold text-[#031B2A] block">Tenant Preference</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'all', label: 'Any' },
                    { id: 'family', label: 'Family' },
                    { id: 'bachelors', label: 'Bachelors' },
                    { id: 'working_professionals', label: 'Corporate' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTenantPref(t.id)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition cursor-pointer border ${
                        selectedTenantPref === t.id
                          ? 'bg-[#0F766E] text-white border-[#0F766E]'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#031B2A] border-[#E2E8F0]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* 5B. RIGHT CONTENT AREA (CARDS OR MAP VIEW) */}
          <main className="flex-1 min-w-0">
            {filteredProperties.length > 0 ? (
              viewMode === 'list' ? (
                /* LIST VIEW: PROPERTY CARDS GRID (FIX 6) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                /* MAP VIEW: SPLIT INTERACTIVE MAP CANVAS (FIX 9) */
                <div className="space-y-5">
                  <div className="bg-white rounded-[28px] border border-[#E2E8F0] shadow-sm overflow-hidden p-4 sm:p-6 space-y-4">
                    {/* Simulated Luxury Emerald Map Canvas */}
                    <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364] overflow-hidden flex items-center justify-center border border-slate-700">
                      
                      {/* Stylized Mumbai Grid Lines */}
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

                      {/* Mumbai Region Label */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-[#031B2A] shadow-sm">
                        📍 Mumbai Coastal &amp; Western Suburbs
                      </div>

                      {/* Interactive Emerald Price Pins */}
                      {[
                        { id: 'prop-mumbai-01', name: 'Bandra West', price: '₹75k', top: '48%', left: '32%' },
                        { id: 'prop-mumbai-02', name: 'Powai', price: '₹68k', top: '35%', left: '68%' },
                        { id: 'prop-mumbai-03', name: 'BKC', price: '₹38k', top: '52%', left: '55%' },
                        { id: 'prop-mumbai-04', name: 'Andheri West', price: '₹24k', top: '28%', left: '38%' },
                        { id: 'prop-mumbai-05', name: 'Worli', price: '₹1.45L', top: '68%', left: '30%' },
                        { id: 'prop-mumbai-06', name: 'Juhu', price: '₹85k', top: '38%', left: '26%' },
                        { id: 'prop-mumbai-07', name: 'Lower Parel', price: '₹62k', top: '72%', left: '38%' },
                      ].map((pin) => {
                        const isSelected = selectedMapPropId === pin.id;
                        return (
                          <button
                            key={pin.id}
                            type="button"
                            onClick={() => setSelectedMapPropId(pin.id)}
                            style={{ top: pin.top, left: pin.left }}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full font-black text-xs transition-all duration-200 cursor-pointer shadow-lg flex items-center gap-1 ${
                              isSelected
                                ? 'bg-[#10B981] text-white scale-125 z-30 ring-4 ring-white/50'
                                : 'bg-[#0F766E] hover:bg-[#064E3B] text-white hover:scale-110 z-20'
                            }`}
                          >
                            <span>📍</span>
                            <span>{pin.price}</span>
                          </button>
                        );
                      })}

                      {/* Bottom Selected Property Mini Banner */}
                      {activeMapProperty && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 border border-white max-w-md mx-auto">
                          <div className="flex items-center gap-3 min-w-0">
                            <Image
                              src={activeMapProperty.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300'}
                              alt={activeMapProperty.title}
                              width={56}
                              height={56}
                              className="w-14 h-14 rounded-xl object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-black uppercase text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md">
                                {activeMapProperty.locality}
                              </span>
                              <h4 className="text-xs font-black text-[#031B2A] truncate mt-0.5">
                                {activeMapProperty.title}
                              </h4>
                              <div className="text-xs font-extrabold text-[#0F766E]">
                                ₹{activeMapProperty.price.toLocaleString('en-IN')}/mo
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/property/${activeMapProperty.id}`}
                            className="px-3.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black shrink-0 transition"
                          >
                            View →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Matching properties underneath map */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              )
            ) : (
              /* FIX 7: PREMIUM EMPTY STATE (NO RAW HTML) */
              <div className="bg-white rounded-[32px] p-8 sm:p-14 text-center border border-[#E2E8F0] shadow-sm max-w-xl mx-auto my-8 space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mx-auto shadow-xs">
                  <Search className="w-8 h-8 stroke-[2.2]" />
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#031B2A]">
                    No homes found matching your exact filters
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 max-w-md mx-auto">
                    Try widening your budget, turning off specific filters, or checking one of Mumbai's most popular rental hubs below.
                  </p>
                </div>

                {/* Popular Localities Quick Buttons */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-extrabold text-[#64748B]">Explore Popular Localities:</span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {['Bandra West', 'Andheri West', 'Powai', 'BKC', 'Worli'].map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSearchQuery(loc);
                          resetFilters();
                          setSearchQuery(loc);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#F1F5F9] hover:bg-[#CCFBF1] text-xs font-bold text-[#031B2A] hover:text-[#064E3B] transition cursor-pointer"
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Filters Primary Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black shadow-md transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* =====================================================================
          FIX 10: MOBILE FILTER DRAWER / MODAL
         ===================================================================== */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white z-20">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#0F766E]" />
                <span className="text-base font-black text-[#031B2A]">All Filters</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body Filters */}
            <div className="p-5 space-y-6 flex-1">
              {/* Budget */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black">
                  <span>Max Rent</span>
                  <span className="text-[#0F766E]">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min={15000}
                  max={150000}
                  step={5000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0F766E]"
                />
              </div>

              {/* BHK */}
              <div className="space-y-2">
                <span className="text-xs font-black text-[#031B2A] block">BHK Layout</span>
                <div className="grid grid-cols-3 gap-2">
                  {BHK_OPTIONS.map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setSelectedBhk(bhk)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold text-center border ${
                        selectedBhk === bhk
                          ? 'bg-[#0F766E] text-white border-[#0F766E]'
                          : 'bg-slate-50 text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <span className="text-xs font-black text-[#031B2A] block">Amenities</span>
                <div className="space-y-2">
                  {AMENITY_OPTIONS.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 text-xs font-semibold text-[#334155]">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(a.id)}
                        onChange={() => toggleAmenity(a.id)}
                        className="w-4 h-4 rounded accent-[#0F766E]"
                      />
                      <span>{a.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Sticky Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-white sticky bottom-0 flex items-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="py-3 px-4 rounded-xl text-xs font-black text-[#64748B] hover:text-[#031B2A] bg-slate-100 flex-1 text-center"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="py-3 px-6 rounded-xl text-xs font-black text-white bg-[#0F766E] flex-2 text-center shadow-md"
              >
                Show {filteredProperties.length} Homes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VOICE AI SEARCH MODAL
         ===================================================================== */}
      {voiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#031B2A]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setVoiceModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white text-center space-y-5 animate-in zoom-in-95 duration-200 z-10">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setVoiceModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-20 h-20 rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mx-auto shadow-md animate-pulse">
              <Mic className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-[#031B2A]">
                Listening for your requirements...
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Say what you are looking for in natural language.
              </p>
            </div>

            {/* Quick voice suggestion chips */}
            <div className="space-y-2 pt-2 text-left">
              <span className="text-[11px] font-black uppercase text-[#0F766E]">Or click a sample voice prompt:</span>
              <div className="space-y-1.5">
                {[
                  '2 BHK in Bandra West under ₹60,000',
                  'Pet friendly studio near Powai lake',
                  'Zero deposit flats near BKC Metro',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setSearchQuery(prompt.split(' in ')[1]?.split(' under ')[0] || prompt);
                      setVoiceModalOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#CCFBF1] text-xs font-bold text-[#031B2A] border border-[#E2E8F0] transition"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
