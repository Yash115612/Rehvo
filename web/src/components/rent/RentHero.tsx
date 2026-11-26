'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Home,
  Building2,
  SlidersHorizontal,
  ChevronDown,
  Navigation,
  X,
  Clock,
  Sparkles,
  Check,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { MUMBAI_COORDINATE_MAP, detectCurrentBrowserLocation } from '@/services/locationService';
import { Breadcrumbs, BreadcrumbItem } from '@/components/seo/Breadcrumbs';

interface RentHeroProps {
  locationValue: string;
  onLocationChange: (val: string) => void;
  bhkValue: string;
  onBhkChange: (val: string) => void;
  propertyTypeValue: string;
  onPropertyTypeChange: (val: string) => void;
  budgetMaxValue: string;
  onBudgetMaxChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSelectPopularLocation: (loc: string) => void;
  breadcrumbs?: BreadcrumbItem[];
}

const POPULAR_MUMBAI_LOCATIONS = [
  'Bandra West',
  'Andheri West',
  'Powai',
  'Worli',
  'BKC',
  'Juhu',
  'Lower Parel',
  'Thane West',
];

const PROPERTY_TYPES = [
  { label: 'All Property Types', value: '' },
  { label: 'Apartment / Flat', value: 'flat' },
  { label: 'Independent Villa', value: 'villa' },
  { label: 'Studio Apartment', value: 'studio' },
  { label: 'Penthouse', value: 'penthouse' },
];

const BHK_PRESETS = [
  { label: 'All BHK', value: '' },
  { label: '1 RK', value: '1 RK' },
  { label: '1 BHK', value: '1 BHK' },
  { label: '2 BHK', value: '2 BHK' },
  { label: '3 BHK', value: '3 BHK' },
  { label: '4+ BHK', value: '4+ BHK' },
];

const BUDGET_PRESETS = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₹35k', value: '35000' },
  { label: '₹35k - ₹60k', value: '60000' },
  { label: '₹60k - ₹1.0L', value: '100000' },
  { label: '₹1.0L+', value: '1000000' },
];

export const RentHero: React.FC<RentHeroProps> = ({
  locationValue,
  onLocationChange,
  bhkValue,
  onBhkChange,
  propertyTypeValue,
  onPropertyTypeChange,
  budgetMaxValue,
  onBudgetMaxChange,
  onSearchSubmit,
  onSelectPopularLocation,
  breadcrumbs,
}) => {
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const locDropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('rehvo_recent_rent_searches') || '[]');
      if (Array.isArray(stored)) {
        setRecentSearches(stored.slice(0, 4));
      }
    } catch {}
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locDropdownRef.current && !locDropdownRef.current.contains(e.target as Node)) {
        setIsLocDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter autocomplete suggestions based on query
  const filteredSuggestions = locationValue.trim()
    ? MUMBAI_COORDINATE_MAP.filter(
        (item) =>
          item.suburb.toLowerCase().includes(locationValue.toLowerCase().trim()) ||
          item.name.toLowerCase().includes(locationValue.toLowerCase().trim())
      ).slice(0, 6)
    : MUMBAI_COORDINATE_MAP.slice(0, 6);

  const handleSelectLocality = (suburb: string) => {
    onLocationChange(suburb);
    setIsLocDropdownOpen(false);

    // Save to recent
    try {
      const updated = Array.from(new Set([suburb, ...recentSearches])).slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem('rehvo_recent_rent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleGpsDetect = async () => {
    setIsDetectingGps(true);
    try {
      const res = await detectCurrentBrowserLocation();
      if (res && res.locality) {
        onLocationChange(res.locality);
        setIsLocDropdownOpen(false);
      }
    } catch (err) {
      console.warn('GPS detection error:', err);
    } finally {
      setIsDetectingGps(false);
    }
  };

  return (
    <section className="relative w-full bg-[#001741] text-white pt-4 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Architectural Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* Seamless Integrated Navy Breadcrumbs */}
        <div className="flex items-center justify-start">
          <Breadcrumbs
            items={breadcrumbs || [{ name: 'Rent Properties', url: '/rent' }]}
            variant="dark"
          />
        </div>

        {/* Top Trust Badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck size={14} className="text-[#F97316]" />
            <span>100% Physical Walkthrough Guarantee &bull; Direct Homeowners</span>
          </div>
        </div>

        {/* Hero Headings */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Find a place that feels like home.
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 font-normal leading-relaxed">
            Discover verified rental homes, transparent pricing and better ways to find your next home across Mumbai.
          </p>
        </div>

        {/* Central Search Interface Dock */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl border border-white/20 text-slate-900">
          <form onSubmit={onSearchSubmit} className="space-y-4">
            {/* Upper Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Location Input with Autocomplete */}
              <div ref={locDropdownRef} className="relative md:col-span-5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                  Location / Locality
                </label>
                <div className="relative flex items-center">
                  <MapPin size={18} className="absolute left-3.5 text-[#F97316] shrink-0 pointer-events-none" />
                  <input
                    type="text"
                    value={locationValue}
                    onChange={(e) => {
                      onLocationChange(e.target.value);
                      setIsLocDropdownOpen(true);
                    }}
                    onFocus={() => setIsLocDropdownOpen(true)}
                    placeholder="Search locality, landmark or station..."
                    className="w-full pl-10 pr-20 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#001741] focus:ring-2 focus:ring-[#001741]/10 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none transition"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {locationValue && (
                      <button
                        type="button"
                        onClick={() => onLocationChange('')}
                        aria-label="Clear location"
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleGpsDetect}
                      disabled={isDetectingGps}
                      title="Detect Current Location"
                      className="p-1.5 rounded-lg bg-slate-200/60 hover:bg-slate-200 text-slate-700 transition"
                    >
                      {isDetectingGps ? (
                        <Loader2 size={14} className="animate-spin text-[#F97316]" />
                      ) : (
                        <Navigation size={14} className="text-[#001741]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Autocomplete Dropdown */}
                {isLocDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && !locationValue && (
                      <div className="px-3 pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Recent Searches
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {recentSearches.map((rec) => (
                            <button
                              key={rec}
                              type="button"
                              onClick={() => handleSelectLocality(rec)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition"
                            >
                              <Clock size={11} className="text-slate-400" />
                              <span>{rec}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    <div className="px-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Popular Mumbai Localities
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto mt-1">
                      {filteredSuggestions.map((item) => (
                        <button
                          key={item.suburb}
                          type="button"
                          onClick={() => handleSelectLocality(item.suburb)}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition group"
                        >
                          <div className="flex items-center gap-2.5">
                            <MapPin size={14} className="text-slate-400 group-hover:text-[#F97316] transition" />
                            <span className="text-xs font-bold text-slate-800">
                              {item.suburb}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">Mumbai</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Property Type Dropdown */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                  Property Type
                </label>
                <div className="relative">
                  <select
                    value={propertyTypeValue}
                    onChange={(e) => onPropertyTypeChange(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#001741] text-sm font-semibold text-slate-900 outline-none transition appearance-none cursor-pointer"
                  >
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Monthly Budget Dropdown */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                  Max Budget
                </label>
                <div className="relative">
                  <select
                    value={budgetMaxValue}
                    onChange={(e) => onBudgetMaxChange(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-[#001741] text-sm font-semibold text-slate-900 outline-none transition appearance-none cursor-pointer"
                  >
                    {BUDGET_PRESETS.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Search CTA Button */}
              <div className="md:col-span-2 pt-5 md:pt-0">
                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#F97316]/25 transition hover:shadow-xl active:scale-95"
                >
                  <Search size={16} strokeWidth={2.5} />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Lower Row: BHK Configuration Pills */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                BHK Configuration:
              </span>
              {BHK_PRESETS.map((bhk) => {
                const isActive = bhkValue === bhk.value;
                return (
                  <button
                    key={bhk.label}
                    type="button"
                    onClick={() => onBhkChange(bhk.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      isActive
                        ? 'bg-[#001741] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {bhk.label}
                  </button>
                );
              })}
            </div>
          </form>
        </div>

        {/* Popular Locations Quick Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="text-slate-300 font-semibold mr-1">Popular in Mumbai:</span>
          {POPULAR_MUMBAI_LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => onSelectPopularLocation(loc)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition backdrop-blur-xs font-medium"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
