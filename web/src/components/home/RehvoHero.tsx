'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Building,
  Building2,
  Store,
  Warehouse,
  Briefcase,
  Layers,
  Home,
  Users,
  BedDouble,
  ChevronDown,
  Sparkles,
  PlusCircle,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';
import { RehvoImage } from '@/components/ui/RehvoImage';

export type HeroSearchCategory = 'homes' | 'commercial' | 'pg_rooms' | 'flatmates';

export const RehvoHero: React.FC = () => {
  const router = useRouter();

  // Search State
  const [activeCategory, setActiveCategory] = useState<HeroSearchCategory>('homes');
  const [selectedType, setSelectedType] = useState<string>('residential:flat');
  const [localityQuery, setLocalityQuery] = useState('');
  const [selectedLocalitySlug, setSelectedLocalitySlug] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  const [localityDropdownOpen, setLocalityDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const localities = Object.entries(MUMBAI_LOCALITIES).map(([slug, info]) => ({
    slug,
    name: info.name,
    zone: info.zone,
  }));

  const filteredLocalities = localityQuery.trim()
    ? localities.filter(
        (l) =>
          l.name.toLowerCase().includes(localityQuery.toLowerCase()) ||
          l.zone.toLowerCase().includes(localityQuery.toLowerCase())
      )
    : localities.slice(0, 8);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setLocalityDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (cat: HeroSearchCategory) => {
    setActiveCategory(cat);
    if (cat === 'homes') setSelectedType('residential:flat');
    else if (cat === 'commercial') setSelectedType('commercial:office');
    else if (cat === 'pg_rooms') setSelectedType('residential:pg');
    else if (cat === 'flatmates') setSelectedType('residential:flatmate');
  };

  const handleSelectLocality = (slug: string, name: string) => {
    setSelectedLocalitySlug(slug);
    setLocalityQuery(name);
    setLocalityDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeCategory === 'flatmates') {
      const loc = selectedLocalitySlug || localityQuery.trim().toLowerCase().replace(/\s+/g, '-');
      router.push(loc ? `/flatmates?locality=${encodeURIComponent(loc)}` : '/flatmates');
      return;
    }

    if (activeCategory === 'commercial') {
      const params = new URLSearchParams();
      if (selectedLocalitySlug) params.set('locality', selectedLocalitySlug);
      else if (localityQuery.trim()) params.set('locality', localityQuery.trim());
      if (selectedBudget) params.set('maxPrice', selectedBudget);
      router.push(`/commercial?${params.toString()}`);
      return;
    }

    if (activeCategory === 'pg_rooms') {
      const params = new URLSearchParams();
      if (selectedLocalitySlug) params.set('locality', selectedLocalitySlug);
      else if (localityQuery.trim()) params.set('locality', localityQuery.trim());
      router.push(`/pg-rooms?${params.toString()}`);
      return;
    }

    // Default: Homes (Residential)
    const params = new URLSearchParams();
    params.set('category', 'residential');
    if (selectedLocalitySlug) params.set('locality', selectedLocalitySlug);
    else if (localityQuery.trim()) params.set('locality', localityQuery.trim().toLowerCase().replace(/\s+/g, '-'));
    if (selectedBudget) params.set('maxPrice', selectedBudget);

    router.push(`/rent?${params.toString()}`);
  };

  return (
    <section className="relative bg-[#F8FAFC] pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden">
      {/* Subtle Warm Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/40 via-amber-100/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Grid: Left Copy + Right Layered Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-12">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0F766E] uppercase tracking-widest bg-[#CCFBF1] px-3 py-1 rounded-full border border-[#99F6E4]/60">
              <Sparkles className="w-3.5 h-3.5" />
              VERIFIED LISTING MARKETPLACE
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.08]">
              Find a place <br />
              that feels like <br />
              <span className="text-[#0F766E]">home.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 font-medium leading-relaxed max-w-md">
              Homes, rooms, PGs, commercial spaces and flatmates across Mumbai — all in one trusted place.
            </p>
          </div>

          {/* Right Column: Architectural Visual & Host Callout */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden shadow-xl bg-stone-100 border-4 border-white">
              <RehvoImage
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=85"
                alt="Modern sunlit living room in Mumbai"
                fill
                priority
                fallbackCategory="property"
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Quick Action Card */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border border-stone-200/80 shadow-lg hidden sm:flex flex-col gap-1.5 z-20 min-w-[200px]">
                <Link
                  href="/list-property"
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#CCFBF1] transition group text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#99F6E4] text-[#0F766E] flex items-center justify-center flex-shrink-0">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-[#0F766E] block leading-tight">
                      List Your Property
                    </span>
                    <span className="text-[10px] text-stone-500">100% free with verified listing</span>
                  </div>
                </Link>
              </div>

              {/* Bottom Visual Guarantee Pill */}
              <div className="absolute bottom-4 left-4 bg-stone-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Direct-to-Owner Listings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Search Dock (03 — SEARCH EXPERIENCE) */}
        <div ref={containerRef} className="max-w-4xl mx-auto">
          {/* Category Tabs Switcher */}
          <div className="flex items-center gap-2 mb-3 px-2">
            {[
              { id: 'homes', label: 'Homes', icon: Home },
              { id: 'commercial', label: 'Commercial', icon: Building2 },
              { id: 'pg_rooms', label: 'PG & Rooms', icon: BedDouble },
              { id: 'flatmates', label: 'Flatmates', icon: Users },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id as HeroSearchCategory)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0F766E]' : 'text-stone-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-3xl p-3 sm:p-4 border border-stone-200/90 shadow-[0_12px_40px_rgb(0,0,0,0.06)] grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            {/* Slot 1: Location */}
            <div className="md:col-span-6 relative pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-stone-200/80 pb-2.5 md:pb-0">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400 pl-3 mb-0.5">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={localityQuery}
                  onChange={(e) => {
                    setLocalityQuery(e.target.value);
                    setSelectedLocalitySlug('');
                    setLocalityDropdownOpen(true);
                  }}
                  onFocus={() => setLocalityDropdownOpen(true)}
                  placeholder="Search locality, area or neighbourhood"
                  className="w-full pl-9 pr-8 py-2 bg-transparent text-xs sm:text-sm font-bold text-stone-900 placeholder:text-stone-400 placeholder:font-medium focus:outline-none"
                />
                <MapPin className="w-4 h-4 text-[#0F766E] absolute left-2 top-2.5 pointer-events-none" />

                {localityQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setLocalityQuery('');
                      setSelectedLocalitySlug('');
                    }}
                    className="absolute right-2 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Dropdown Menu */}
                {localityDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 max-h-60 overflow-y-auto">
                    {filteredLocalities.map((item) => (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => handleSelectLocality(item.slug, item.name)}
                        className="w-full px-4 py-2 text-left hover:bg-[#CCFBF1] flex items-center justify-between group text-xs"
                      >
                        <span className="font-bold text-stone-800 group-hover:text-[#0F766E]">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold">
                          {item.zone}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Slot 2: Budget / Filter */}
            <div className="md:col-span-3 relative pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-stone-200/80 pb-2.5 md:pb-0">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400 pl-3 mb-0.5">
                Max Budget
              </label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full pl-3 pr-7 py-2 bg-transparent text-xs sm:text-sm font-bold text-stone-900 focus:outline-none cursor-pointer appearance-none"
                aria-label="Select maximum budget"
              >
                <option value="">Any Budget</option>
                <option value="20000">Up to ₹20,000</option>
                <option value="35000">Up to ₹35,000</option>
                <option value="50000">Up to ₹50,000</option>
                <option value="75000">Up to ₹75,000</option>
                <option value="150000">Up to ₹1,50,000</option>
                <option value="300000">Up to ₹3,00,000+</option>
              </select>
            </div>

            {/* Slot 3: Search Action Button */}
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-[#0F766E] hover:bg-[#064E3B] text-white rounded-2xl py-3.5 px-5 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
