'use client';

import React from 'react';
import { X, Check, RotateCcw } from 'lucide-react';

interface FilterDrawerState {
  roomPreference: string;
  minBudget: number;
  maxBudget: number;
  locality: string;
  moveInTiming: string;
  lifestyleTags: string[];
}

interface FlatmatesFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterDrawerState;
  onFilterChange: (filters: FilterDrawerState) => void;
  onReset: () => void;
}

const LIFESTYLE_OPTIONS = [
  'WFH',
  'Non-Smoker',
  'Vegetarian',
  'Early Riser',
  'Night Owl',
  'Clean & Organized',
  'Pet Friendly',
  'Fitness Enthusiast',
  'Quiet Environment',
];

const LOCALITIES = [
  'All Localities',
  'Andheri West',
  'Bandra West',
  'Powai',
  'Worli',
  'Juhu',
  'Lower Parel',
  'BKC / Bandra East',
  'Thane West',
];

export const FlatmatesFilterDrawer: React.FC<FlatmatesFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) => {
  if (!isOpen) return null;

  const toggleLifestyle = (tag: string) => {
    const next = filters.lifestyleTags.includes(tag)
      ? filters.lifestyleTags.filter((t) => t !== tag)
      : [...filters.lifestyleTags, tag];
    onFilterChange({ ...filters, lifestyleTags: next });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md h-full bg-white/95 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between border-l border-white/80 overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200/80">
          <div>
            <h3 className="text-lg font-black text-[#031B2A]">Advanced Flatmate Filters</h3>
            <p className="text-xs text-[#64748B] font-semibold">Tailor your roommate preferences</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full rehvo-glass-subtle flex items-center justify-center text-[#64748B] hover:text-[#031B2A] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 py-5 space-y-6">
          <div>
            <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider mb-2">
              Room Preference
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Any', value: '' },
                { label: 'Private Room', value: 'private_room' },
                { label: 'Shared Room', value: 'shared_room' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, roomPreference: opt.value })}
                  className={'h-10 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center text-center cursor-pointer ' + (filters.roomPreference === opt.value ? 'bg-[#031B2A] text-white font-black' : 'rehvo-glass-subtle text-[#031B2A] hover:bg-white')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider mb-2">
              Preferred Locality
            </label>
            <select
              value={filters.locality}
              onChange={(e) => onFilterChange({ ...filters, locality: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl rehvo-glass-subtle text-xs font-bold text-[#031B2A] focus:outline-none border border-white/80 cursor-pointer"
            >
              {LOCALITIES.map((loc) => (
                <option key={loc} value={loc === 'All Localities' ? '' : loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider">
                Max Monthly Budget
              </label>
              <span className="text-xs font-black text-[#3C8D68]">
                ₹{filters.maxBudget.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={60000}
              step={2000}
              value={filters.maxBudget}
              onChange={(e) => onFilterChange({ ...filters, maxBudget: Number(e.target.value) })}
              className="w-full accent-[#3C8D68] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-bold text-[#64748B] mt-1">
              <span>₹10k</span>
              <span>₹35k</span>
              <span>₹60k+</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider mb-2">
              Move-in Timing
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Anytime', value: '' },
                { label: 'Immediate', value: 'Immediate' },
                { label: 'Within 30d', value: 'Within 30 days' },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, moveInTiming: opt.value })}
                  className={'h-10 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center text-center cursor-pointer ' + (filters.moveInTiming === opt.value ? 'bg-[#031B2A] text-white font-black' : 'rehvo-glass-subtle text-[#031B2A] hover:bg-white')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#031B2A] uppercase tracking-wider mb-2">
              Lifestyle & Habits
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LIFESTYLE_OPTIONS.map((tag) => {
                const isSelected = filters.lifestyleTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleLifestyle(tag)}
                    className={'h-8 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ' + (isSelected ? 'bg-[#EBF5F0] text-[#3C8D68] border border-[#3C8D68]/40 font-black' : 'rehvo-glass-subtle text-[#64748B] hover:text-[#031B2A]')}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check className="w-3 h-3 text-[#3C8D68]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200/80 flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 h-11 rounded-full rehvo-glass-subtle text-xs font-bold text-[#64748B] hover:text-[#031B2A] flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-2 h-11 rounded-full bg-[#031B2A] text-white hover:bg-black text-xs font-black flex items-center justify-center transition shadow-md cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
