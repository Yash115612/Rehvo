'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Users, SlidersHorizontal, Sparkles, X, ChevronDown, Check, ShieldCheck, MessageCircle, Zap } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface FlatmatesHeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  maxBudget: string;
  onMaxBudgetChange: (val: string) => void;
  roomPreference: string;
  onRoomPreferenceChange: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
}

const BUDGET_OPTIONS = [
  { label: 'Any Budget', value: '' },
  { label: 'Under ₹15,000', value: '15000' },
  { label: 'Under ₹20,000', value: '20000' },
  { label: 'Under ₹25,000', value: '25000' },
  { label: 'Under ₹35,000', value: '35000' },
  { label: 'Under ₹50,000', value: '50000' },
];

const ROOM_OPTIONS = [
  { label: 'Any Room', value: '' },
  { label: 'Private Room', value: 'private_room' },
  { label: 'Shared Room', value: 'shared_room' },
];

export const FlatmatesHero: React.FC<FlatmatesHeroProps> = ({
  searchQuery,
  onSearchChange,
  maxBudget,
  onMaxBudgetChange,
  roomPreference,
  onRoomPreferenceChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);

  const budgetRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setBudgetOpen(false);
      }
      if (roomRef.current && !roomRef.current.contains(e.target as Node)) {
        setRoomOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentBudgetLabel =
    BUDGET_OPTIONS.find((b) => b.value === maxBudget)?.label || 'Any Budget';
  const currentRoomLabel =
    ROOM_OPTIONS.find((r) => r.value === roomPreference)?.label || 'Any Room';

  return (
    <section className="relative w-full rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 rehvo-glass-hero border border-white/80 shadow-md overflow-visible">
      {/* 2-Column Composition: Left Content & Right Lifestyle Image */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
        {/* Left Content Area (~55%) */}
        <div className="flex-1 w-full space-y-3 sm:space-y-4 text-left">
          {/* Eyebrow in #3C8D68 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F0]/90 backdrop-blur-md text-[#3C8D68] text-[11px] font-black tracking-wide border border-[#3C8D68]/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FLATMATE COMMUNITY • VERIFIED LISTING</span>
          </div>

          {/* Compact Headline (42-50px desktop, 28-36px mobile) */}
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-[#031B2A] tracking-tight leading-[1.12]">
            Find someone you’ll <br className="hidden sm:block" />
            actually enjoy living with.
          </h1>

          {/* Supporting Text */}
          <p className="text-xs sm:text-sm text-[#64748B] font-semibold max-w-xl leading-relaxed">
            Discover verified flatmates with compatible budgets, locations and lifestyles across Mumbai.
          </p>

          {/* Trust Chips Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#031B2A] bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/80 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-[#3C8D68]" />
              <span>Verified Profiles</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#031B2A] bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/80 shadow-2xs">
              <MessageCircle className="w-3 h-3 text-[#0F766E]" />
              <span>Direct Chat</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#031B2A] bg-white/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/80 shadow-2xs">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Instant Wave</span>
            </span>
          </div>
        </div>

        {/* Right Lifestyle Visual (~42%) */}
        <div className="w-full lg:w-[42%] max-w-md lg:max-w-none shrink-0">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] max-h-[340px] rounded-[24px] overflow-hidden bg-[#F1F5F9] border border-white/80 shadow-md group">
            <RehvoImage
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80"
              alt="Roommates hanging out in living room"
              fill
              priority
              fallbackCategory="flatmate"
              className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
              sizes="(max-width: 1024px) 100vw, 450px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Live Badge */}
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#031B2A] text-[11px] font-bold shadow-sm border border-white/80">
              <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse" />
              <span>Verified Roommates in Mumbai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Compact Liquid Glass Search Dock */}
      <div className="mt-5 sm:mt-6 pt-5 border-t border-white/60" style={{ position: 'relative', zIndex: 40 }}>
        <form
          onSubmit={onSearchSubmit}
          className="rehvo-glass-card rounded-2xl sm:rounded-full p-1.5 sm:p-2 flex flex-col sm:flex-row items-center gap-2 shadow-sm border border-white/90 bg-white/60 backdrop-blur-md"
        >
          {/* Locality Input */}
          <div className="flex-1 w-full flex items-center gap-2.5 px-3.5 py-1.5 sm:py-0 relative">
            <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search locality, area or flatmate..."
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] placeholder:text-[#64748B] focus:outline-none truncate"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                aria-label="Clear search"
                className="p-1 text-[#64748B] hover:text-[#031B2A] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="hidden sm:block w-px h-6 bg-stone-300/60" />
          <div className="block sm:hidden w-full h-px bg-stone-200/60" />

          {/* Room Preference Dropdown */}
          <div
            className="relative w-full sm:w-40 px-3.5 py-1.5 sm:py-0 flex items-center gap-1.5"
            style={{ zIndex: roomOpen ? 50 : 20 }}
            ref={roomRef}
          >
            <Users className="w-4 h-4 text-[#64748B] shrink-0" />
            <button
              type="button"
              onClick={() => {
                setRoomOpen((prev) => !prev);
                setBudgetOpen(false);
              }}
              className="w-full flex items-center justify-between gap-1 bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] focus:outline-none cursor-pointer text-left"
              aria-label="Select room preference"
            >
              <span className="truncate">{currentRoomLabel}</span>
              <ChevronDown className={'w-3.5 h-3.5 text-[#64748B] transition-transform ' + (roomOpen ? 'rotate-180' : '')} />
            </button>

            {roomOpen && (
              <div className="absolute left-0 sm:left-auto right-0 top-full mt-2 w-48 rehvo-glass-dropdown rounded-2xl p-1.5 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-150 bg-white/95 backdrop-blur-xl z-50">
                {ROOM_OPTIONS.map((opt) => {
                  const isSelected = roomPreference === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onRoomPreferenceChange(opt.value);
                        setRoomOpen(false);
                      }}
                      className={'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ' +
                        (isSelected ? 'bg-[#3C8D68]/15 text-[#3C8D68]' : 'text-[#031B2A] hover:bg-stone-100/80')
                      }
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#3C8D68]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden sm:block w-px h-6 bg-stone-300/60" />
          <div className="block sm:hidden w-full h-px bg-stone-200/60" />

          {/* Max Budget Dropdown */}
          <div
            className="relative w-full sm:w-44 px-3.5 py-1.5 sm:py-0 flex items-center gap-1.5"
            style={{ zIndex: budgetOpen ? 50 : 20 }}
            ref={budgetRef}
          >
            <SlidersHorizontal className="w-4 h-4 text-[#64748B] shrink-0" />
            <button
              type="button"
              onClick={() => {
                setBudgetOpen((prev) => !prev);
                setRoomOpen(false);
              }}
              className="w-full flex items-center justify-between gap-1 bg-transparent text-xs sm:text-sm font-bold text-[#031B2A] focus:outline-none cursor-pointer text-left"
              aria-label="Select max budget"
            >
              <span className="truncate">{currentBudgetLabel}</span>
              <ChevronDown className={'w-3.5 h-3.5 text-[#64748B] transition-transform ' + (budgetOpen ? 'rotate-180' : '')} />
            </button>

            {budgetOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rehvo-glass-dropdown rounded-2xl p-1.5 shadow-2xl border border-white/80 animate-in fade-in zoom-in-95 duration-150 bg-white/95 backdrop-blur-xl z-50">
                {BUDGET_OPTIONS.map((opt) => {
                  const isSelected = maxBudget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onMaxBudgetChange(opt.value);
                        setBudgetOpen(false);
                      }}
                      className={'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left cursor-pointer ' +
                        (isSelected ? 'bg-[#3C8D68]/15 text-[#3C8D68]' : 'text-[#031B2A] hover:bg-stone-100/80')
                      }
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#3C8D68]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full sm:w-auto h-10 px-6 rounded-xl sm:rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </section>
  );
};
