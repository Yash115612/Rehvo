'use client';

import React from 'react';
import { X, SlidersHorizontal, Check, RefreshCw, ShieldCheck } from 'lucide-react';

export interface RentFiltersState {
  locality: string;
  bhk: string;
  minPrice: string;
  maxPrice: string;
  furnishing: string;
  type: string;
  verifiedOnly: boolean;
}

interface RentFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RentFiltersState;
  onUpdateFilter: <K extends keyof RentFiltersState>(key: K, value: RentFiltersState[K]) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  totalMatchingCount: number;
}

const FURNISHING_OPTIONS = [
  { label: 'Any Furnishing', value: '' },
  { label: 'Fully Furnished', value: 'fully_furnished' },
  { label: 'Semi-Furnished', value: 'semi_furnished' },
  { label: 'Unfurnished', value: 'unfurnished' },
];

const PROPERTY_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Apartment / Flat', value: 'flat' },
  { label: 'Independent Villa', value: 'villa' },
  { label: 'Studio Flat', value: 'studio' },
  { label: 'Penthouse', value: 'penthouse' },
];

const BHK_LIST = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio'];

export const RentFilterDrawer: React.FC<RentFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilter,
  onApplyFilters,
  onResetFilters,
  totalMatchingCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-[#031B2A]/40 backdrop-blur-md transition-opacity cursor-pointer animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between border-l border-white/80 animate-in slide-in-from-right duration-250">
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-white/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl rehvo-glass-subtle text-[#0F766E] flex items-center justify-center font-bold shadow-2xs">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#031B2A]">Filter Properties</h2>
                <p className="text-[11px] font-medium text-[#64748B]">Refine rental homes in Mumbai</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close filter drawer"
              className="w-8 h-8 rounded-full rehvo-glass-subtle text-[#031B2A] hover:bg-white/80 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1 no-scrollbar">
            {/* 1. Locality / Neighbourhood */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider">
                Locality / Area
              </label>
              <div className="rehvo-glass-subtle rounded-2xl p-2.5 border border-white/80 shadow-2xs">
                <input
                  type="text"
                  value={filters.locality}
                  onChange={(e) => onUpdateFilter('locality', e.target.value)}
                  placeholder="e.g. Bandra West, Andheri, Powai"
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] placeholder:text-[#64748B]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Monthly Budget Range */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider">
                Monthly Rent Budget (₹)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="rehvo-glass-subtle rounded-2xl p-2.5 border border-white/80 shadow-2xs">
                  <span className="text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-0.5 block">Min Rent</span>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => onUpdateFilter('minPrice', e.target.value)}
                    placeholder="₹10,000"
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] focus:outline-none"
                  />
                </div>
                <div className="rehvo-glass-subtle rounded-2xl p-2.5 border border-white/80 shadow-2xs">
                  <span className="text-[10px] text-[#64748B] font-black uppercase tracking-wider mb-0.5 block">Max Rent</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => onUpdateFilter('maxPrice', e.target.value)}
                    placeholder="₹1,50,000"
                    className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. BHK Configuration */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider">
                BHK Configuration
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateFilter('bhk', '')}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    !filters.bhk
                      ? 'rehvo-glass-card text-[#031B2A] font-black shadow-xs border-white/90 -translate-y-0.5'
                      : 'rehvo-glass-subtle text-[#64748B] hover:text-[#031B2A] hover:bg-white/60'
                  }`}
                >
                  Any BHK
                </button>
                {BHK_LIST.map((bhk) => {
                  const isSelected = filters.bhk === bhk;
                  return (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => onUpdateFilter('bhk', isSelected ? '' : bhk)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                        isSelected
                          ? 'rehvo-glass-card text-[#031B2A] font-black shadow-xs border-white/90 -translate-y-0.5'
                          : 'rehvo-glass-subtle text-[#64748B] hover:text-[#031B2A] hover:bg-white/60'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] block" />}
                      <span>{bhk}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Furnishing */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider">
                Furnishing Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FURNISHING_OPTIONS.map((f) => {
                  const isSelected = filters.furnishing === f.value;
                  return (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => onUpdateFilter('furnishing', f.value)}
                      className={`py-2.5 px-3.5 rounded-2xl text-xs font-bold text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'rehvo-glass-card text-[#031B2A] font-black shadow-xs border-white/90 -translate-y-0.5'
                          : 'rehvo-glass-subtle text-[#64748B] hover:text-[#031B2A] hover:bg-white/60'
                      }`}
                    >
                      <span>{f.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Property Type */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider">
                Property Type
              </label>
              <div className="space-y-2">
                {PROPERTY_TYPES.map((pt) => {
                  const isSelected = filters.type === pt.value;
                  return (
                    <button
                      key={pt.label}
                      type="button"
                      onClick={() => onUpdateFilter('type', pt.value)}
                      className={`w-full py-3 px-4 rounded-2xl text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                        isSelected
                          ? 'rehvo-glass-card text-[#031B2A] font-black shadow-xs border-white/90'
                          : 'rehvo-glass-subtle text-[#64748B] hover:text-[#031B2A] hover:bg-white/60'
                      }`}
                    >
                      <span>{pt.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#0F766E]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Verified Only Toggle */}
            <div className="pt-3 border-t border-white/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-black text-[#031B2A]">Verified Homes Only</span>
                  <span className="block text-[11px] text-[#64748B]">Physically inspected residences</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateFilter('verifiedOnly', !filters.verifiedOnly)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  filters.verifiedOnly ? 'bg-[#0F766E]' : 'bg-black/10'
                }`}
                aria-label="Toggle verified only filter"
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white block absolute top-1 shadow-sm transition-transform ${
                    filters.verifiedOnly ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-5 border-t border-white/60 bg-white/70 backdrop-blur-md flex items-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="flex-1 py-3.5 rounded-2xl rehvo-glass-subtle hover:bg-white/90 text-[#031B2A] text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/80 shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className="flex-2 py-3.5 rounded-2xl rehvo-glass-coral text-white text-xs sm:text-sm font-extrabold flex items-center justify-center shadow-md transition active:scale-98 cursor-pointer"
            >
              <span>Show {totalMatchingCount} Homes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
