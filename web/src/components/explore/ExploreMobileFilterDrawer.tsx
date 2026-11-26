'use client';

import React, { useEffect } from 'react';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { ExploreFiltersState } from './ExploreFilterSidebar';

interface ExploreMobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ExploreFiltersState;
  onUpdateFilter: <K extends keyof ExploreFiltersState>(key: K, value: ExploreFiltersState[K]) => void;
  onResetAll: () => void;
  onApply: () => void;
  totalMatchingCount: number;
}

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio'];

const PROPERTY_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Apartment / Flat', value: 'flat' },
  { label: 'Independent Villa', value: 'villa' },
  { label: 'Studio Apartment', value: 'studio' },
  { label: 'Penthouse', value: 'penthouse' },
  { label: 'Shared / Room', value: 'room' },
];

const FURNISHING_OPTIONS = [
  { label: 'Any Furnishing', value: '' },
  { label: 'Fully Furnished', value: 'fully_furnished' },
  { label: 'Semi-Furnished', value: 'semi_furnished' },
  { label: 'Unfurnished', value: 'unfurnished' },
];

const TENANT_PREFERENCES = [
  { label: 'All Tenants', value: '' },
  { label: 'Family', value: 'family' },
  { label: 'Bachelors', value: 'bachelors' },
  { label: 'Working Professionals', value: 'working_professionals' },
  { label: 'Students', value: 'students' },
];

const AMENITY_ITEMS = [
  { id: 'parking', label: 'Covered Parking' },
  { id: 'lift', label: 'Elevator / Lift' },
  { id: 'balcony', label: 'Private Balcony' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
  { id: 'security', label: '24x7 Security & CCTV' },
  { id: 'power_backup', label: 'Power Backup' },
  { id: 'gym', label: 'Gymnasium' },
  { id: 'pool', label: 'Swimming Pool' },
];

export const ExploreMobileFilterDrawer: React.FC<ExploreMobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilter,
  onResetAll,
  onApply,
  totalMatchingCount,
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleAmenity = (id: string) => {
    const current = filters.amenities || [];
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onUpdateFilter('amenities', next);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#001741]/50 backdrop-blur-xs transition-opacity cursor-pointer animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-[#001741]" />
              <h2 className="text-base font-extrabold text-[#001741]">
                Filters
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              aria-label="Close filters"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 divide-y divide-slate-100 text-xs">
            {/* 1. Verification & Zero Commission */}
            <div className="space-y-3 pt-0">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Verification &amp; Source
              </h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={18} className="text-[#F97316]" />
                    <div>
                      <div className="font-bold text-[#001741]">100% Verified Only</div>
                      <div className="text-[10px] text-slate-500">Index-II title deed verified</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => onUpdateFilter('verifiedOnly', e.target.checked)}
                    className="w-4 h-4 rounded text-[#001741] focus:ring-[#001741]"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">₹</span>
                    <div>
                      <div className="font-bold text-[#001741]">Zero Commission (Owner)</div>
                      <div className="text-[10px] text-slate-500">Direct homeowner connection</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.ownerOnly}
                    onChange={(e) => onUpdateFilter('ownerOnly', e.target.checked)}
                    className="w-4 h-4 rounded text-[#001741] focus:ring-[#001741]"
                  />
                </label>
              </div>
            </div>

            {/* 2. BHK Configuration */}
            <div className="space-y-3 pt-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                BHK Layout
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {BHK_OPTIONS.map((bhk) => {
                  const isSelected = filters.bhk === bhk;
                  return (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => onUpdateFilter('bhk', isSelected ? '' : bhk)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                        isSelected
                          ? 'bg-[#001741] text-white border-[#001741]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {bhk}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Monthly Rent Budget */}
            <div className="space-y-3 pt-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Monthly Rent (₹)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Min Rent</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => onUpdateFilter('minPrice', e.target.value)}
                    placeholder="₹ 15,000"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-[#001741]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">Max Rent</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => onUpdateFilter('maxPrice', e.target.value)}
                    placeholder="₹ 1,50,000"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-[#001741]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Property Type */}
            <div className="space-y-3 pt-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Property Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_TYPES.map((pt) => {
                  const isSelected = filters.propertyType === pt.value;
                  return (
                    <button
                      key={pt.label}
                      type="button"
                      onClick={() => onUpdateFilter('propertyType', pt.value)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition border truncate ${
                        isSelected
                          ? 'bg-[#001741] text-white border-[#001741]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {pt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Furnishing Status */}
            <div className="space-y-3 pt-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Furnishing
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {FURNISHING_OPTIONS.map((furn) => {
                  const isSelected = filters.furnishing === furn.value;
                  return (
                    <button
                      key={furn.label}
                      type="button"
                      onClick={() => onUpdateFilter('furnishing', furn.value)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition border truncate ${
                        isSelected
                          ? 'bg-[#001741] text-white border-[#001741]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {furn.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Tenant Preference */}
            <div className="space-y-3 pt-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tenant Preference
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {TENANT_PREFERENCES.map((pref) => {
                  const isSelected = filters.tenantPreference === pref.value;
                  return (
                    <button
                      key={pref.label}
                      type="button"
                      onClick={() => onUpdateFilter('tenantPreference', pref.value)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition border truncate ${
                        isSelected
                          ? 'bg-[#001741] text-white border-[#001741]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {pref.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 7. Amenities */}
            <div className="space-y-3 pt-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Amenities &amp; Facilities
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_ITEMS.map((amenity) => {
                  const isChecked = (filters.amenities || []).includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                        isChecked
                          ? 'bg-slate-50 border-[#001741] text-[#001741] font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAmenity(amenity.id)}
                        className="w-3.5 h-3.5 rounded text-[#001741] focus:ring-[#001741]"
                      />
                      <span className="truncate">{amenity.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
            <button
              type="button"
              onClick={onResetAll}
              className="py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onApply();
                onClose();
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-[#001741] hover:bg-[#0B1F3A] text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Show {totalMatchingCount} Properties</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
