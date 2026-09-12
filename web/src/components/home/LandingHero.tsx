'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Building,
  Home,
  BedDouble,
  Users,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck,
  MessageCircle,
  HomeIcon,
  ChevronDown,
  Check,
} from 'lucide-react';

type SearchCategory = 'rent' | 'commercial' | 'pg-rooms' | 'flatmates';

interface CategoryConfig {
  id: SearchCategory;
  label: string;
  icon: React.ElementType;
  accentColor: string;
  placeholder: string;
  typeOptions: { label: string; value: string }[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'rent',
    label: 'Homes',
    icon: Home,
    accentColor: '#0F766E',
    placeholder: 'Search locality, society or area',
    typeOptions: [
      { label: 'BHK / Type', value: '' },
      { label: '1 BHK', value: '1 BHK' },
      { label: '2 BHK', value: '2 BHK' },
      { label: '3 BHK', value: '3 BHK' },
      { label: '4+ BHK', value: '4+ BHK' },
      { label: 'Studio', value: 'Studio' },
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial',
    icon: Building,
    accentColor: '#4263EB',
    placeholder: 'Search office, shop or commercial area',
    typeOptions: [
      { label: 'Space Type', value: '' },
      { label: 'Office Space', value: 'office' },
      { label: 'Retail Shop', value: 'shop' },
      { label: 'Showroom', value: 'showroom' },
      { label: 'Co-working', value: 'coworking' },
      { label: 'Warehouse', value: 'warehouse' },
    ],
  },
  {
    id: 'pg-rooms',
    label: 'PG & Rooms',
    icon: BedDouble,
    accentColor: '#D69E2E',
    placeholder: 'Search PG, room or locality',
    typeOptions: [
      { label: 'Stay Type', value: '' },
      { label: 'Managed PG', value: 'pg' },
      { label: 'Private Room', value: 'room' },
      { label: 'Shared Room', value: 'shared' },
      { label: 'Co-Living', value: 'coliving' },
    ],
  },
];

const BUDGET_OPTIONS = [
  { label: 'Max Budget', value: '' },
  { label: 'Under ₹25,000', value: '25000' },
  { label: 'Under ₹40,000', value: '40000' },
  { label: 'Under ₹60,000', value: '60000' },
  { label: 'Under ₹1,00,000', value: '100000' },
  { label: '₹1,00,000+', value: '100001' },
];

export const LandingHero: React.FC = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('rent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [budgetDropdownOpen, setBudgetDropdownOpen] = useState(false);
  const [focusedTypeIndex, setFocusedTypeIndex] = useState(-1);
  const [focusedBudgetIndex, setFocusedBudgetIndex] = useState(-1);

  const typeRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const typeButtonRef = useRef<HTMLButtonElement>(null);
  const budgetButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setBudgetDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setTypeDropdownOpen(false);
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

  const currentConfig = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  const currentTypeOption =
    currentConfig.typeOptions.find((opt) => opt.value === selectedType) || currentConfig.typeOptions[0];
  const typeDisplayLabel = currentTypeOption.label;

  const currentBudgetOption =
    BUDGET_OPTIONS.find((opt) => opt.value === selectedBudget) || BUDGET_OPTIONS[0];
  const budgetDisplayLabel = currentBudgetOption.label;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTypeDropdownOpen(false);
    setBudgetDropdownOpen(false);

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('locality', searchQuery.trim());
    }
    if (selectedType) {
      if (activeCategory === 'rent') params.set('bhk', selectedType);
      else if (activeCategory === 'commercial') params.set('type', selectedType);
      else if (activeCategory === 'pg-rooms') params.set('type', selectedType);
    }
    if (selectedBudget) {
      params.set('maxPrice', selectedBudget);
    }

    const qs = params.toString() ? `?${params.toString()}` : '';
    router.push(`/${activeCategory}${qs}`);
  };

  const handleTypeKeyDown = (e: React.KeyboardEvent) => {
    if (!typeDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setTypeDropdownOpen(true);
        setBudgetDropdownOpen(false);
        setFocusedTypeIndex(0);
      }
      return;
    }

    const maxIdx = currentConfig.typeOptions.length - 1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedTypeIndex((prev) => (prev < maxIdx ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedTypeIndex((prev) => (prev > 0 ? prev - 1 : maxIdx));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedTypeIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedTypeIndex(maxIdx);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedTypeIndex >= 0 && focusedTypeIndex <= maxIdx) {
        setSelectedType(currentConfig.typeOptions[focusedTypeIndex].value);
        setTypeDropdownOpen(false);
        typeButtonRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setTypeDropdownOpen(false);
      typeButtonRef.current?.focus();
    }
  };

  const handleBudgetKeyDown = (e: React.KeyboardEvent) => {
    if (!budgetDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setBudgetDropdownOpen(true);
        setTypeDropdownOpen(false);
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
        setSelectedBudget(BUDGET_OPTIONS[focusedBudgetIndex].value);
        setBudgetDropdownOpen(false);
        budgetButtonRef.current?.focus();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setBudgetDropdownOpen(false);
      budgetButtonRef.current?.focus();
    }
  };

  return (
    <section className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center -mt-16 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Hero Image with Warm Subtle Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1600&auto=format&fit=crop&q=85')`,
          }}
        />
        {/* Soft Warm Editorial Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/90 via-[#F8FAFC]/65 to-[#F8FAFC] pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1040px] mx-auto text-center space-y-6 sm:space-y-7">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-[#031B2A] text-[11px] sm:text-xs font-bold shadow-xs">
          <span className="text-[#0F766E]">🏠</span>
          <span>Homes, spaces & people — together</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#031B2A] tracking-tight leading-[1.12] max-w-3xl mx-auto">
          Find the right <br className="hidden sm:block" />
          experience for you.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg font-medium text-[#64748B] max-w-xl mx-auto leading-relaxed">
          Homes, commercial spaces, stays and people brought together under one trusted marketplace.
        </p>

        {/* Integrated Search Box */}
        <div
          className="max-w-3xl mx-auto space-y-3"
          style={{ position: 'relative', zIndex: 40 }}
        >
          {/* Category Switcher Rail */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-full rehvo-glass-subtle shadow-xs">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedType('');
                    setTypeDropdownOpen(false);
                    setBudgetDropdownOpen(false);
                  }}
                  className={`h-9 px-4 sm:px-5 rounded-full text-xs font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'rehvo-glass-card text-[#031B2A] shadow-xs font-extrabold -translate-y-0.5'
                      : 'text-[#64748B] hover:text-[#031B2A] hover:bg-white/40'
                  }`}
                >
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: isActive ? cat.accentColor : undefined }}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Inputs Card */}
          <form
            onSubmit={handleSearchSubmit}
            className="rehvo-glass-hero rounded-[26px] sm:rounded-full p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2"
            style={{ position: 'relative', zIndex: 40 }}
          >
            {/* Locality Input */}
            <div className="flex-1 w-full flex items-center gap-2.5 px-4 py-2.5 sm:py-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentConfig.placeholder}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] placeholder:text-[#64748B]/60 focus:outline-none truncate"
              />
              <Search className="w-4 h-4 text-[#64748B]/70 shrink-0" />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/70" />
            <div className="block sm:hidden w-full h-px bg-white/50" />

            {/* Type Selector Custom Liquid-Glass Dropdown */}
            <div
              className="relative w-full sm:w-36 px-4 py-2 sm:py-0 flex items-center"
              style={{ zIndex: typeDropdownOpen ? 50 : 20 }}
              ref={typeRef}
            >
              <button
                ref={typeButtonRef}
                type="button"
                onKeyDown={handleTypeKeyDown}
                onClick={(e) => {
                  e.stopPropagation();
                  setTypeDropdownOpen((prev) => !prev);
                  setBudgetDropdownOpen(false);
                  setFocusedTypeIndex(-1);
                }}
                className={`w-full flex items-center justify-between gap-1.5 bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] focus:outline-none cursor-pointer text-left py-1 rounded-lg transition-colors ${
                  typeDropdownOpen ? 'text-[#0F766E]' : 'hover:text-[#0F766E]'
                }`}
                aria-haspopup="listbox"
                aria-expanded={typeDropdownOpen}
                aria-label="Select property type or BHK"
              >
                <span className="truncate">{typeDisplayLabel}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                    typeDropdownOpen ? 'rotate-180 text-[#0F766E]' : ''
                  }`}
                />
              </button>

              {/* Custom Glass Popover */}
              {typeDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+10px)] sm:top-[calc(100%+12px)] w-full sm:w-56 rehvo-glass-dropdown shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={handleTypeKeyDown}
                >
                  <div className="space-y-0.5 max-h-60 overflow-y-auto no-scrollbar">
                    {currentConfig.typeOptions.map((opt, idx) => {
                      const isSelected = selectedType === opt.value;
                      const isFocused = focusedTypeIndex === idx;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => setFocusedTypeIndex(idx)}
                          onClick={() => {
                            setSelectedType(opt.value);
                            setTypeDropdownOpen(false);
                            typeButtonRef.current?.focus();
                          }}
                          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
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

            {/* Budget Selector Custom Liquid-Glass Dropdown */}
            <div
              className="relative w-full sm:w-40 px-4 py-2 sm:py-0 flex items-center"
              style={{ zIndex: budgetDropdownOpen ? 50 : 20 }}
              ref={budgetRef}
            >
              <button
                ref={budgetButtonRef}
                type="button"
                onKeyDown={handleBudgetKeyDown}
                onClick={(e) => {
                  e.stopPropagation();
                  setBudgetDropdownOpen((prev) => !prev);
                  setTypeDropdownOpen(false);
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

              {/* Custom Glass Popover */}
              {budgetDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+10px)] sm:top-[calc(100%+12px)] w-full sm:w-60 rehvo-glass-dropdown shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={handleBudgetKeyDown}
                >
                  <div className="space-y-0.5 max-h-60 overflow-y-auto no-scrollbar">
                    {BUDGET_OPTIONS.map((opt, idx) => {
                      const isSelected = selectedBudget === opt.value;
                      const isFocused = focusedBudgetIndex === idx;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => setFocusedBudgetIndex(idx)}
                          onClick={() => {
                            setSelectedBudget(opt.value);
                            setBudgetDropdownOpen(false);
                            budgetButtonRef.current?.focus();
                          }}
                          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
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

            {/* Search Button */}
            <button
              type="submit"
              className="w-full sm:w-auto h-11 px-7 rounded-full rehvo-glass-coral font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </form>
        </div>

        {/* 04 Trust Strip Reassurance Chips */}
        <div
          className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 pt-2"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>Verified Listing</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Verified Listings</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] shadow-2xs">
            <MessageCircle className="w-3.5 h-3.5 text-[#4263EB]" />
            <span>Direct Connect</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] shadow-2xs">
            <CalendarCheck className="w-3.5 h-3.5 text-[#D69E2E]" />
            <span>Easy Visits</span>
          </div>
        </div>
      </div>
    </section>
  );
};
