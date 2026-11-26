'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  MapPin,
  Navigation,
  X,
  Clock,
  Loader2,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { MUMBAI_COORDINATE_MAP, detectCurrentBrowserLocation } from '@/services/locationService';
import { Breadcrumbs, BreadcrumbItem } from '@/components/seo/Breadcrumbs';

interface ExploreHeaderProps {
  locationValue: string;
  onLocationChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  totalCount: number;
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

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  locationValue,
  onLocationChange,
  onSearchSubmit,
  totalCount,
  breadcrumbs,
}) => {
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('rehvo_recent_explore_searches') || '[]');
      if (Array.isArray(stored)) {
        setRecentSearches(stored.slice(0, 4));
      }
    } catch {}
  }, []);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLocDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

    try {
      const updated = Array.from(new Set([suburb, ...recentSearches])).slice(0, 4);
      setRecentSearches(updated);
      localStorage.setItem('rehvo_recent_explore_searches', JSON.stringify(updated));
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
    <div className="w-full bg-[#001741] text-white pt-4 pb-7 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Seamless Integrated Navy Breadcrumbs */}
        <div className="flex items-center justify-start">
          <Breadcrumbs
            items={breadcrumbs || [{ name: 'Explore Properties', url: '/explore' }]}
            variant="dark"
          />
        </div>

        {/* Title and Badge Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-[11px] font-semibold mb-2">
              <ShieldCheck size={13} className="text-[#F97316]" />
              <span>100% Verified Direct Owners &bull; Zero Commission</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore Properties
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5">
              Find your next home with verified listings and transparent rental information.
            </p>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs text-slate-300">Live Inventory</span>
            <div className="text-lg font-black text-white">
              {totalCount} Verified Homes
            </div>
          </div>
        </div>

        {/* Compact Search Dock */}
        <form onSubmit={onSearchSubmit} className="pt-1">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input Box */}
            <div ref={dropdownRef} className="relative flex-1 w-full">
              <div className="relative flex items-center">
                <MapPin size={16} className="absolute left-3.5 text-[#F97316] pointer-events-none" />
                <input
                  type="text"
                  value={locationValue}
                  onChange={(e) => {
                    onLocationChange(e.target.value);
                    setIsLocDropdownOpen(true);
                  }}
                  onFocus={() => setIsLocDropdownOpen(true)}
                  placeholder="Search locality, area or station in Mumbai..."
                  className="w-full pl-10 pr-20 py-2.5 bg-white rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none shadow-md focus:ring-2 focus:ring-[#F97316]/50 transition"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  {locationValue && (
                    <button
                      type="button"
                      onClick={() => onLocationChange('')}
                      aria-label="Clear location"
                      className="p-1 rounded text-slate-400 hover:text-slate-600 transition"
                    >
                      <X size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleGpsDetect}
                    disabled={isDetectingGps}
                    title="Detect Current Location"
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    {isDetectingGps ? (
                      <Loader2 size={13} className="animate-spin text-[#F97316]" />
                    ) : (
                      <Navigation size={13} className="text-[#001741]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Suggestions Dropdown */}
              {isLocDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                  {recentSearches.length > 0 && !locationValue && (
                    <div className="px-3 pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Recent Searches
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
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

                  <div className="px-3 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Mumbai Localities
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto mt-1">
                    {filteredSuggestions.map((item) => (
                      <button
                        key={item.suburb}
                        type="button"
                        onClick={() => handleSelectLocality(item.suburb)}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center justify-between transition group"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={13} className="text-slate-400 group-hover:text-[#F97316] transition" />
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

            {/* Search Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition shrink-0"
            >
              <Search size={15} strokeWidth={2.5} />
              <span>Search</span>
            </button>
          </div>
        </form>

        {/* Popular Mumbai Location Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-300 text-[11px] font-semibold mr-1">Popular:</span>
          {POPULAR_MUMBAI_LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => handleSelectLocality(loc)}
              className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 text-[11px] font-medium transition"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
