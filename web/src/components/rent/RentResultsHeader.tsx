'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { RentFiltersState } from './RentFilterDrawer';

interface RentResultsHeaderProps {
  totalCount: number;
  currentSort: string;
  onSortChange: (sortVal: string) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  filters: RentFiltersState;
  onRemoveFilter: <K extends keyof RentFiltersState>(key: K) => void;
  onClearAllFilters: () => void;
}

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Largest Area', value: 'area_desc' },
];

export const RentResultsHeader: React.FC<RentResultsHeaderProps> = ({
  totalCount,
  currentSort,
  onSortChange,
  onOpenFilterDrawer,
  activeFilterCount,
  filters,
  onRemoveFilter,
  onClearAllFilters,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [focusedSortIndex, setFocusedSortIndex] = useState(-1);
  const sortRef = useRef<HTMLDivElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentSortOption =
    SORT_OPTIONS.find((s) => s.value === currentSort) || SORT_OPTIONS[0];

  const handleSortKeyDown = (e: React.KeyboardEvent) => {
    if (!sortOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSortOpen(true);
        setFocusedSortIndex(0);
      }
      return;
    }

    const maxIdx = SORT_OPTIONS.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSortIndex((prev) => (prev < maxIdx ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSortIndex((prev) => (prev > 0 ? prev - 1 : maxIdx));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedSortIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedSortIndex(maxIdx);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedSortIndex >= 0 && focusedSortIndex <= maxIdx) {
        onSortChange(SORT_OPTIONS[focusedSortIndex].value);
        setSortOpen(false);
        sortBtnRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSortOpen(false);
      sortBtnRef.current?.focus();
    }
  };

  const hasActiveFilters =
    Boolean(filters.locality) ||
    Boolean(filters.bhk) ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice) ||
    Boolean(filters.furnishing) ||
    Boolean(filters.type) ||
    filters.verifiedOnly;

  return (
    <div className="space-y-3 pt-3 border-t border-white/60">
      {/* Count & Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-[#031B2A] tracking-tight">
            {totalCount.toLocaleString('en-IN')} {totalCount === 1 ? 'home' : 'homes'} available for rent
          </h2>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">
            Verified listings • Owner & agent contacts across Mumbai
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Advanced Filter Trigger Button */}
          <button
            type="button"
            onClick={onOpenFilterDrawer}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs ${
              activeFilterCount > 0
                ? 'rehvo-glass-card text-[#031B2A] font-extrabold border-white/90'
                : 'rehvo-glass-subtle text-[#031B2A] hover:bg-white/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0F766E] text-white text-[10px] flex items-center justify-center font-black ml-0.5 shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Custom Liquid Glass Sort Dropdown */}
          <div className="relative" ref={sortRef} style={{ zIndex: sortOpen ? 50 : 20 }}>
            <button
              ref={sortBtnRef}
              type="button"
              onKeyDown={handleSortKeyDown}
              onClick={() => {
                setSortOpen((prev) => !prev);
                setFocusedSortIndex(-1);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold rehvo-glass-subtle text-[#031B2A] hover:bg-white/60 transition shadow-2xs cursor-pointer ${
                sortOpen ? 'border-white/90' : ''
              }`}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              aria-label="Sort properties"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[#64748B] font-medium hidden sm:inline">Sort:</span>
              <span className="font-extrabold truncate max-w-[130px]">{currentSortOption.label}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                  sortOpen ? 'rotate-180 text-[#0F766E]' : ''
                }`}
              />
            </button>

            {/* Floating Glass Popover */}
            {sortOpen && (
              <div
                role="listbox"
                className="absolute right-0 top-[calc(100%+8px)] w-52 rehvo-glass-dropdown shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleSortKeyDown}
              >
                <div className="space-y-0.5">
                  {SORT_OPTIONS.map((opt, idx) => {
                    const isSelected = currentSort === opt.value;
                    const isFocused = focusedSortIndex === idx;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setFocusedSortIndex(idx)}
                        onClick={() => {
                          onSortChange(opt.value);
                          setSortOpen(false);
                          sortBtnRef.current?.focus();
                        }}
                        className={`w-full min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                          isSelected
                            ? 'bg-white/90 text-[#031B2A] font-black shadow-xs'
                            : isFocused
                            ? 'bg-white/60 text-[#031B2A]'
                            : 'text-[#031B2A] hover:bg-white/50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider">Active:</span>

          {filters.locality && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full rehvo-glass-subtle text-[#031B2A] shadow-2xs border border-white/80">
              <span className="text-[#0F766E] font-black">Locality:</span>
              <span>{filters.locality}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter('locality')}
                aria-label="Remove locality filter"
                className="p-0.5 text-[#64748B] hover:text-[#0F766E] cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.bhk && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full rehvo-glass-subtle text-[#031B2A] shadow-2xs border border-white/80">
              <span>{filters.bhk}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter('bhk')}
                aria-label="Remove BHK filter"
                className="p-0.5 text-[#64748B] hover:text-[#0F766E] cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(filters.minPrice || filters.maxPrice) && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full rehvo-glass-subtle text-[#031B2A] shadow-2xs border border-white/80">
              <span>
                ₹{filters.minPrice ? Number(filters.minPrice).toLocaleString('en-IN') : '0'} - ₹{filters.maxPrice ? Number(filters.maxPrice).toLocaleString('en-IN') : 'Any'}
              </span>
              <button
                type="button"
                onClick={() => {
                  onRemoveFilter('minPrice');
                  onRemoveFilter('maxPrice');
                }}
                aria-label="Remove price filter"
                className="p-0.5 text-[#64748B] hover:text-[#0F766E] cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.furnishing && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full rehvo-glass-subtle text-[#031B2A] shadow-2xs border border-white/80">
              <span className="capitalize">{filters.furnishing.replace('_', ' ')}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter('furnishing')}
                aria-label="Remove furnishing filter"
                className="p-0.5 text-[#64748B] hover:text-[#0F766E] cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.type && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full rehvo-glass-subtle text-[#031B2A] shadow-2xs border border-white/80">
              <span className="capitalize">{filters.type}</span>
              <button
                type="button"
                onClick={() => onRemoveFilter('type')}
                aria-label="Remove property type filter"
                className="p-0.5 text-[#64748B] hover:text-[#0F766E] cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.verifiedOnly && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full rehvo-glass-subtle text-[#16A34A] shadow-2xs border border-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] block" />
              <span>Verified Only</span>
              <button
                type="button"
                onClick={() => onRemoveFilter('verifiedOnly')}
                aria-label="Remove verified filter"
                className="p-0.5 text-[#64748B] hover:text-[#0F766E] cursor-pointer ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onClearAllFilters}
            className="text-xs font-black text-[#0F766E] hover:underline cursor-pointer ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
