'use client';

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  MapPin,
  Sparkles,
} from 'lucide-react';

export interface ExploreFiltersState {
  city: string;
  locality: string;
  bhk: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  furnishing: string;
  tenantPreference: string;
  amenities: string[];
  verifiedOnly: boolean;
  ownerOnly: boolean;
  availability: string;
}

interface ExploreFilterSidebarProps {
  filters: ExploreFiltersState;
  onUpdateFilter: <K extends keyof ExploreFiltersState>(key: K, value: ExploreFiltersState[K]) => void;
  onResetAll: () => void;
  activeFilterCount: number;
}

const CITY_OPTIONS = ['Mumbai', 'Pune', 'Bangalore'];

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK', 'Studio'];

const BUDGET_PRESETS = [
  { label: 'All', max: '' },
  { label: '< ₹35k', max: '35000' },
  { label: '₹35k-₹60k', min: '35000', max: '60000' },
  { label: '₹60k-₹1.0L', min: '60000', max: '100000' },
  { label: '₹1.0L+', min: '100000', max: '' },
];

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
  { id: 'power_backup', label: '100% Power Backup' },
  { id: 'gym', label: 'Gymnasium' },
  { id: 'pool', label: 'Swimming Pool' },
];

const AVAILABILITY_OPTIONS = [
  { label: 'Any Time', value: '' },
  { label: 'Available Immediately', value: 'immediate' },
  { label: 'Within 15 Days', value: '15_days' },
  { label: 'Within 30 Days', value: '30_days' },
];

export const ExploreFilterSidebar: React.FC<ExploreFilterSidebarProps> = ({
  filters,
  onUpdateFilter,
  onResetAll,
  activeFilterCount,
}) => {
  // Collapsible state for sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    verification: true,
    budget: true,
    bhk: true,
    propertyType: true,
    furnishing: true,
    tenantPref: false,
    amenities: true,
    availability: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAmenity = (id: string) => {
    const current = filters.amenities || [];
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    onUpdateFilter('amenities', next);
  };

  const sliderMaxPrice = filters.maxPrice ? parseInt(filters.maxPrice, 10) : 250000;

  return (
    <aside className="w-[290px] shrink-0 hidden lg:block sticky top-24 z-20">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#001741]" />
            <h2 className="text-sm font-extrabold text-[#001741] tracking-tight">
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#001741] text-white text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onResetAll}
              className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] transition flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset All</span>
            </button>
          )}
        </div>

        {/* Scrollable Filter Sections */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 divide-y divide-slate-100 text-slate-800 text-xs">
          {/* 1. Verification & Zero Commission */}
          <div className="space-y-3 pt-0">
            <button
              type="button"
              onClick={() => toggleSection('verification')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>Verification &amp; Source</span>
              {openSections.verification ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.verification && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#F97316]" />
                    <span className="font-bold text-[#001741]">100% Verified Only</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => onUpdateFilter('verifiedOnly', e.target.checked)}
                    className="w-4 h-4 rounded text-[#001741] focus:ring-[#001741] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">₹</span>
                    <span className="font-bold text-[#001741]">Zero Commission (Owner)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={filters.ownerOnly}
                    onChange={(e) => onUpdateFilter('ownerOnly', e.target.checked)}
                    className="w-4 h-4 rounded text-[#001741] focus:ring-[#001741] cursor-pointer"
                  />
                </label>
              </div>
            )}
          </div>

          {/* 2. Monthly Budget */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('budget')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>Monthly Rent (₹)</span>
              {openSections.budget ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.budget && (
              <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Max Budget:</span>
                  <span className="font-black text-[#001741]">
                    {sliderMaxPrice >= 250000 ? '₹2,50,000+' : `₹${sliderMaxPrice.toLocaleString('en-IN')}`}
                  </span>
                </div>

                <input
                  type="range"
                  min={10000}
                  max={250000}
                  step={5000}
                  value={sliderMaxPrice}
                  onChange={(e) => onUpdateFilter('maxPrice', e.target.value)}
                  className="w-full accent-[#001741] cursor-pointer"
                />

                {/* Min & Max Inputs */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Min (₹)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => onUpdateFilter('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-[#001741]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Max (₹)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => onUpdateFilter('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 outline-none focus:border-[#001741]"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {BUDGET_PRESETS.map((p) => {
                    const isSelected =
                      (p.max === '' && filters.maxPrice === '') ||
                      (filters.maxPrice === p.max && (!p.min || filters.minPrice === p.min));
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          onUpdateFilter('minPrice', p.min || '');
                          onUpdateFilter('maxPrice', p.max || '');
                        }}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition border ${
                          isSelected
                            ? 'bg-[#001741] text-white border-[#001741]'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. BHK Configuration */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('bhk')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>BHK Layout</span>
              {openSections.bhk ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.bhk && (
              <div className="grid grid-cols-3 gap-1.5 pt-1 animate-in fade-in duration-150">
                {BHK_OPTIONS.map((bhk) => {
                  const isSelected = filters.bhk === bhk;
                  return (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => onUpdateFilter('bhk', isSelected ? '' : bhk)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold transition border truncate ${
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
            )}
          </div>

          {/* 4. Property Type */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('propertyType')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>Property Type</span>
              {openSections.propertyType ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.propertyType && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {PROPERTY_TYPES.map((pt) => {
                  const isSelected = filters.propertyType === pt.value;
                  return (
                    <button
                      key={pt.label}
                      type="button"
                      onClick={() => onUpdateFilter('propertyType', pt.value)}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-slate-50 text-[#001741] font-bold border-[#001741]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{pt.label}</span>
                      {isSelected && <Check size={13} className="text-[#F97316]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Furnishing Status */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('furnishing')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>Furnishing</span>
              {openSections.furnishing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.furnishing && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {FURNISHING_OPTIONS.map((furn) => {
                  const isSelected = filters.furnishing === furn.value;
                  return (
                    <button
                      key={furn.label}
                      type="button"
                      onClick={() => onUpdateFilter('furnishing', furn.value)}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-slate-50 text-[#001741] font-bold border-[#001741]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{furn.label}</span>
                      {isSelected && <Check size={13} className="text-[#F97316]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 6. Tenant Preferences */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('tenantPref')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>Tenant Preference</span>
              {openSections.tenantPref ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.tenantPref && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {TENANT_PREFERENCES.map((pref) => {
                  const isSelected = filters.tenantPreference === pref.value;
                  return (
                    <button
                      key={pref.label}
                      type="button"
                      onClick={() => onUpdateFilter('tenantPreference', pref.value)}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-slate-50 text-[#001741] font-bold border-[#001741]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{pref.label}</span>
                      {isSelected && <Check size={13} className="text-[#F97316]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 7. Amenities Checklist */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('amenities')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>Amenities</span>
              {openSections.amenities ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.amenities && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {AMENITY_ITEMS.map((amenity) => {
                  const isChecked = (filters.amenities || []).includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition ${
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
            )}
          </div>

          {/* 8. Availability */}
          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={() => toggleSection('availability')}
              className="w-full flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition"
            >
              <span>Availability</span>
              {openSections.availability ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {openSections.availability && (
              <div className="space-y-1.5 pt-1 animate-in fade-in duration-150">
                {AVAILABILITY_OPTIONS.map((avail) => {
                  const isSelected = filters.availability === avail.value;
                  return (
                    <button
                      key={avail.label}
                      type="button"
                      onClick={() => onUpdateFilter('availability', avail.value)}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between border ${
                        isSelected
                          ? 'bg-slate-50 text-[#001741] font-bold border-[#001741]'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{avail.label}</span>
                      {isSelected && <Check size={13} className="text-[#F97316]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
