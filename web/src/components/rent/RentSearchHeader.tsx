'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Home,
  Building2,
  BedDouble,
  SlidersHorizontal,
  PlusCircle,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';

interface RentSearchHeaderProps {
  localityInput: string;
  onLocalityChange: (val: string) => void;
  bhkInput: string;
  onBhkChange: (val: string) => void;
  maxBudgetInput: string;
  onMaxBudgetChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
}

const CATEGORY_LINKS = [
  { label: 'Homes', href: '/rent', icon: Home, accentColor: '#0F766E', active: true },
  { label: 'Commercial', href: '/commercial', icon: Building2, accentColor: '#4263EB', active: false },
  { label: 'PG & Rooms', href: '/pg-rooms', icon: BedDouble, accentColor: '#D69E2E', active: false },
];

const BHK_OPTIONS = [
  { label: 'BHK / Type', value: '' },
  { label: '1 RK', value: '1 RK' },
  { label: '1 BHK', value: '1 BHK' },
  { label: '2 BHK', value: '2 BHK' },
  { label: '3 BHK', value: '3 BHK' },
  { label: '4+ BHK', value: '4+ BHK' },
  { label: 'Studio', value: 'Studio' },
];

const BUDGET_OPTIONS = [
  { label: 'Max Budget', value: '' },
  { label: 'Under ₹25,000', value: '25000' },
  { label: 'Under ₹35,000', value: '35000' },
  { label: 'Under ₹50,000', value: '50000' },
  { label: 'Under ₹75,000', value: '75000' },
  { label: 'Under ₹1,00,000', value: '100000' },
  { label: 'Under ₹1,50,000', value: '150000' },
];

export const RentSearchHeader: React.FC<RentSearchHeaderProps> = ({
  localityInput,
  onLocalityChange,
  bhkInput,
  onBhkChange,
  maxBudgetInput,
  onMaxBudgetChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  const [bhkDropdownOpen, setBhkDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [focusedBhkIndex, setFocusedBhkIndex] = useState(-1);
  const [focusedBudgetIndex, setFocusedBudgetIndex] = useState(-1);

  const bhkRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const bhkBtnRef = useRef<HTMLButtonElement>(null);
  const budgetBtnRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (bhkRef.current && !bhkRef.current.contains(e.target as Node)) {
        setBhkDropdownOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setBudgetDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setBhkDropdownOpen(false);
        setBudgetDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentBhkOption =
    BHK_OPTIONS.find((opt) => opt.value === bhkInput) || BHK_OPTIONS[0];
  const bhkDisplayLabel = currentBhkOption.label;

  const currentBudgetOption =
    BUDGET_OPTIONS.find((opt) => opt.value === maxBudgetInput) || BUDGET_OPTIONS[0];
  const budgetDisplayLabel = currentBudgetOption.label;

  const handleBhkKeyDown = (e: React.KeyboardEvent) => {
    if (!bhkDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setBhkDropdownOpen(true);
        setBudgetDropdownOpen(false);
        setFocusedBhkIndex(0);
      }
      return;
    }

    const maxIdx = BHK_OPTIONS.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedBhkIndex((prev) => (prev < maxIdx ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedBhkIndex((prev) => (prev > 0 ? prev - 1 : maxIdx));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedBhkIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedBhkIndex(maxIdx);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedBhkIndex >= 0 && focusedBhkIndex <= maxIdx) {
        onBhkChange(BHK_OPTIONS[focusedBhkIndex].value);
        setBhkDropdownOpen(false);
        bhkBtnRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setBhkDropdownOpen(false);
      bhkBtnRef.current?.focus();
    }
  };

  const handleBudgetKeyDown = (e: React.KeyboardEvent) => {
    if (!budgetDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setBudgetDropdownOpen(true);
        setBhkDropdownOpen(false);
        setFocusedBudgetIndex(0);
      }
      return;
    }

    const maxIdx = BUDGET_OPTIONS.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedBudgetIndex((prev) => (prev < maxIdx ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedBudgetIndex((prev) => (prev > 0 ? prev - 1 : maxIdx));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedBudgetIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedBudgetIndex(maxIdx);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedBudgetIndex >= 0 && focusedBudgetIndex <= maxIdx) {
        onMaxBudgetChange(BUDGET_OPTIONS[focusedBudgetIndex].value);
        setBudgetDropdownOpen(false);
        budgetBtnRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setBudgetDropdownOpen(false);
      budgetBtnRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    setBhkDropdownOpen(false);
    setBudgetDropdownOpen(false);
    onSearchSubmit(e);
  };

  return (
    <section className="relative w-full pt-1 pb-1 space-y-3" style={{ position: 'relative', zIndex: 40 }}>
      {/* Centered Category Rail & List Property Action */}
      <div className="w-full flex items-center justify-center pt-1 overflow-x-auto no-scrollbar py-0.5">
        <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 rounded-full rehvo-glass-subtle shadow-xs shrink-0">
          {CATEGORY_LINKS.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`h-8 px-3.5 sm:px-4 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  cat.active
                    ? 'rehvo-glass-card text-[#031B2A] shadow-xs font-black -translate-y-0.5'
                    : 'text-[#64748B] hover:text-[#031B2A] hover:bg-white/40'
                }`}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: cat.active ? cat.accentColor : undefined }}
                />
                <span>{cat.label}</span>
                {cat.active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full block"
                    style={{ backgroundColor: cat.accentColor }}
                  />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-4 bg-white/70 mx-0.5" />

          {/* List Property Action Button */}
          <Link
            href="/list-property"
            className="h-8 px-3.5 sm:px-4 rounded-full text-xs font-black flex items-center gap-1.5 transition-all duration-200 cursor-pointer text-[#0F766E] hover:bg-[#0F766E]/10 hover:shadow-2xs active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>List Property</span>
          </Link>
        </div>
      </div>

      {/* Compact Liquid-Glass Search Dock Bar */}
      <form
        onSubmit={handleSubmit}
        className="w-full rehvo-glass-hero rounded-2xl sm:rounded-full p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-md border border-white/80"
        style={{ position: 'relative', zIndex: 40 }}
      >
        {/* Locality Input */}
        <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-1 sm:py-0 relative">
          <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
          <input
            type="text"
            value={localityInput}
            onChange={(e) => onLocalityChange(e.target.value)}
            placeholder="Search locality, society or landmark in Mumbai..."
            className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#031B2A] placeholder:text-[#64748B] focus:outline-none truncate"
          />
          {localityInput && (
            <button
              type="button"
              onClick={onClearSearch}
              aria-label="Clear location"
              className="p-1 text-[#64748B] hover:text-[#031B2A] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/70" />
        <div className="block sm:hidden w-full h-px bg-white/50" />

        {/* BHK Selector Custom Dropdown */}
        <div
          className="relative w-full sm:w-44 px-3 py-1 sm:py-0 flex items-center gap-2"
          style={{ zIndex: bhkDropdownOpen ? 50 : 20 }}
          ref={bhkRef}
        >
          <Home className="w-4 h-4 text-[#64748B] shrink-0" />
          <button
            ref={bhkBtnRef}
            type="button"
            onKeyDown={handleBhkKeyDown}
            onClick={(e) => {
              e.stopPropagation();
              setBhkDropdownOpen((prev) => !prev);
              setBudgetDropdownOpen(false);
              setFocusedBhkIndex(-1);
            }}
            className={`w-full flex items-center justify-between gap-1.5 bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] focus:outline-none cursor-pointer text-left py-1 rounded-lg transition-colors ${
              bhkDropdownOpen ? 'text-[#0F766E]' : 'hover:text-[#0F766E]'
            }`}
            aria-haspopup="listbox"
            aria-expanded={bhkDropdownOpen}
            aria-label="Select BHK configuration"
          >
            <span className="truncate">{bhkDisplayLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                bhkDropdownOpen ? 'rotate-180 text-[#0F766E]' : ''
              }`}
            />
          </button>

          {/* Floating Glass Popover */}
          {bhkDropdownOpen && (
            <div
              role="listbox"
              className="absolute left-0 top-[calc(100%+10px)] sm:top-[calc(100%+12px)] w-full sm:w-56 rehvo-glass-dropdown shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleBhkKeyDown}
            >
              <div className="space-y-0.5 max-h-60 overflow-y-auto no-scrollbar">
                {BHK_OPTIONS.map((opt, idx) => {
                  const isSelected = bhkInput === opt.value;
                  const isFocused = focusedBhkIndex === idx;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setFocusedBhkIndex(idx)}
                      onClick={() => {
                        onBhkChange(opt.value);
                        setBhkDropdownOpen(false);
                        bhkBtnRef.current?.focus();
                      }}
                      className={`w-full min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-white/90 text-[#031B2A] font-black shadow-xs'
                          : isFocused
                          ? 'bg-white/60 text-[#031B2A]'
                          : 'text-[#031B2A] hover:bg-white/60'
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

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/70" />
        <div className="block sm:hidden w-full h-px bg-white/50" />

        {/* Max Budget Custom Dropdown */}
        <div
          className="relative w-full sm:w-44 px-3 py-1 sm:py-0 flex items-center gap-2"
          style={{ zIndex: budgetDropdownOpen ? 50 : 20 }}
          ref={budgetRef}
        >
          <SlidersHorizontal className="w-4 h-4 text-[#64748B] shrink-0" />
          <button
            ref={budgetBtnRef}
            type="button"
            onKeyDown={handleBudgetKeyDown}
            onClick={(e) => {
              e.stopPropagation();
              setBudgetDropdownOpen((prev) => !prev);
              setBhkDropdownOpen(false);
              setFocusedBudgetIndex(-1);
            }}
            className={`w-full flex items-center justify-between gap-1.5 bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] focus:outline-none cursor-pointer text-left py-1 rounded-lg transition-colors ${
              budgetDropdownOpen ? 'text-[#0F766E]' : 'hover:text-[#0F766E]'
            }`}
            aria-haspopup="listbox"
            aria-expanded={budgetDropdownOpen}
            aria-label="Select maximum budget"
          >
            <span className="truncate">{budgetDisplayLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                budgetDropdownOpen ? 'rotate-180 text-[#0F766E]' : ''
              }`}
            />
          </button>

          {/* Floating Glass Popover */}
          {budgetDropdownOpen && (
            <div
              role="listbox"
              className="absolute left-0 top-[calc(100%+10px)] sm:top-[calc(100%+12px)] w-full sm:w-56 rehvo-glass-dropdown shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleBudgetKeyDown}
            >
              <div className="space-y-0.5 max-h-60 overflow-y-auto no-scrollbar">
                {BUDGET_OPTIONS.map((opt, idx) => {
                  const isSelected = maxBudgetInput === opt.value;
                  const isFocused = focusedBudgetIndex === idx;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setFocusedBudgetIndex(idx)}
                      onClick={() => {
                        onMaxBudgetChange(opt.value);
                        setBudgetDropdownOpen(false);
                        budgetBtnRef.current?.focus();
                      }}
                      className={`w-full min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-white/90 text-[#031B2A] font-black shadow-xs'
                          : isFocused
                          ? 'bg-white/60 text-[#031B2A]'
                          : 'text-[#031B2A] hover:bg-white/60'
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

        {/* Search Submit Action */}
        <button
          type="submit"
          className="w-full sm:w-auto h-10 px-6 rounded-full rehvo-glass-coral font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-98 transition cursor-pointer shrink-0 text-white"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
        </button>
      </form>
    </section>
  );
};
