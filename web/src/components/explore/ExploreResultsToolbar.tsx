'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Check,
  Grid,
  List,
  Map as MapIcon,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { ExploreFiltersState } from './ExploreFilterSidebar';

interface ExploreResultsToolbarProps {
  totalCount: number;
  currentSort: string;
  onSortChange: (sortVal: string) => void;
  onOpenMobileDrawer: () => void;
  activeFilterCount: number;
  filters: ExploreFiltersState;
  onRemoveFilter: <K extends keyof ExploreFiltersState>(key: K) => void;
  onClearAllFilters: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  showMap: boolean;
  onToggleMap: () => void;
  localityQuery?: string;
}

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Recently Added', value: 'newest' },
  { label: 'Rent: Low to High', value: 'price_asc' },
  { label: 'Rent: High to Low', value: 'price_desc' },
  { label: 'Largest Area', value: 'area_desc' },
];

export const ExploreResultsToolbar: React.FC<ExploreResultsToolbarProps> = ({
  totalCount,
  currentSort,
  onSortChange,
  onOpenMobileDrawer,
  activeFilterCount,
  filters,
  onRemoveFilter,
  onClearAllFilters,
  viewMode,
  onViewModeChange,
  showMap,
  onToggleMap,
  localityQuery,
}) => {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.value === currentSort)?.label || 'Recommended';

  // Active filter chips construction
  const activeChips: { label: string; key: keyof ExploreFiltersState }[] = [];
  if (filters.locality) {
    activeChips.push({ label: `Locality: ${filters.locality}`, key: 'locality' });
  }
  if (filters.bhk) {
    activeChips.push({ label: `${filters.bhk}`, key: 'bhk' });
  }
  if (filters.minPrice || filters.maxPrice) {
    const minText = filters.minPrice ? `₹${Number(filters.minPrice).toLocaleString('en-IN')}` : '₹0';
    const maxText = filters.maxPrice ? `₹${Number(filters.maxPrice).toLocaleString('en-IN')}` : 'Any';
    activeChips.push({ label: `${minText} – ${maxText}`, key: 'maxPrice' });
  }
  if (filters.furnishing) {
    const fLabel =
      filters.furnishing === 'fully_furnished'
        ? 'Furnished'
        : filters.furnishing === 'semi_furnished'
        ? 'Semi-Furnished'
        : 'Unfurnished';
    activeChips.push({ label: fLabel, key: 'furnishing' });
  }
  if (filters.propertyType) {
    activeChips.push({ label: `Type: ${filters.propertyType}`, key: 'propertyType' });
  }
  if (filters.tenantPreference) {
    activeChips.push({ label: `Prefers: ${filters.tenantPreference}`, key: 'tenantPreference' });
  }
  if (filters.verifiedOnly) {
    activeChips.push({ label: '100% Verified Only', key: 'verifiedOnly' });
  }
  if (filters.ownerOnly) {
    activeChips.push({ label: 'Zero Commission Only', key: 'ownerOnly' });
  }
  if (filters.availability) {
    activeChips.push({ label: `Available: ${filters.availability}`, key: 'availability' });
  }

  const contextTitle = localityQuery
    ? `Properties in ${localityQuery}, Mumbai`
    : 'Properties in Mumbai';

  return (
    <div className="space-y-3">
      {/* Upper Toolbar Controls */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title and Count */}
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#001741] tracking-tight">
            {contextTitle}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Showing {totalCount} verified listings &bull; Direct Landlords &bull; Zero Brokerage
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Filter Button (visible only < lg) */}
          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className={`lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              activeFilterCount > 0
                ? 'bg-[#001741] text-white border-[#001741]'
                : 'bg-white text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#F97316] text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Map Toggle Button */}
          <button
            type="button"
            onClick={onToggleMap}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
              showMap
                ? 'bg-[#001741] text-white border-[#001741]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            <MapIcon size={13} />
            <span>Map</span>
          </button>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:inline-flex items-center bg-slate-50 rounded-xl border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-[#001741] shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Grid size={14} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-white text-[#001741] shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List size={14} />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition"
            >
              <ArrowUpDown size={12} className="text-slate-400" />
              <span>{currentSortLabel}</span>
              <ChevronDown size={13} className="text-slate-400 ml-0.5" />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between transition ${
                      currentSort === opt.value
                        ? 'bg-slate-50 text-[#001741] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {currentSort === opt.value && <Check size={13} className="text-[#F97316]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Active filters:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-slate-800 text-xs font-semibold border border-slate-200 shadow-xs"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter(chip.key)}
                className="hover:text-red-600 transition"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onClearAllFilters}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline px-2 py-1 transition"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
