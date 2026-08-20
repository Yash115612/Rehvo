'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Building,
  Home,
  Users,
  ShieldCheck,
  MessageSquare,
  CalendarCheck,
  Heart,
  ChevronDown,
  Sparkles,
  PlusCircle,
  X,
} from 'lucide-react';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

export const RehvoHero: React.FC = () => {
  const router = useRouter();

  // Search State
  const [selectedType, setSelectedType] = useState<string>('any');
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

  const handleSelectLocality = (slug: string, name: string) => {
    setSelectedLocalitySlug(slug);
    setLocalityQuery(name);
    setLocalityDropdownOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedType === 'flatmate') {
      router.push('/flatmates/mumbai');
      return;
    }

    const params = new URLSearchParams();
    params.set('city', 'mumbai');

    if (selectedLocalitySlug) {
      params.set('locality', selectedLocalitySlug);
    } else if (localityQuery.trim()) {
      params.set('locality', localityQuery.trim().toLowerCase().replace(/\s+/g, '-'));
    }

    if (selectedType !== 'any') {
      params.set('type', selectedType);
    }

    if (selectedBudget) {
      params.set('maxPrice', selectedBudget);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative bg-[#FAF8F5] pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-stone-200/60">
      {/* Subtle Warm Sunset Ambient Glow in Top-Left */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/40 via-amber-100/20 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 relative z-10">
        {/* Main Hero Grid: 45% Left Copy / 55% Right Arched Living Room Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-14">
          {/* Left Column (5 Cols on Desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Eyebrow */}
            <span className="text-xs sm:text-sm font-extrabold text-[#FF5533] uppercase tracking-widest block">
              RENT. LIVE. BELONG.
            </span>

            {/* Display Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-stone-900 tracking-tight leading-[1.05]">
              Find a place <br />
              that feels like <br />
              <span className="text-[#FF5533]">home.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-md">
              Flats, rooms, PGs and flatmates — all in one trusted place.
            </p>
          </div>

          {/* Right Column (7 Cols on Desktop) — Arched Architectural Interior Photography */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-[36px] overflow-hidden shadow-2xl shadow-stone-900/10 bg-stone-100 border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&auto=format&fit=crop&q=85"
                alt="Modern sunlit living room with floor-to-ceiling windows"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              {/* Floating Action Popover Card (Top-Right of Image) */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-stone-200/80 shadow-xl hidden sm:flex flex-col gap-2 z-20 min-w-[210px]">
                <Link
                  href="/owner/properties/new"
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-orange-50 transition group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5533] flex items-center justify-center flex-shrink-0">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-[#FF5533] block leading-tight">
                      List Your Property
                    </span>
                    <span className="text-[10px] text-stone-500">Rent out your property</span>
                  </div>
                </Link>

                <div className="border-t border-stone-100" />

                <Link
                  href="/flatmates/create"
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-orange-50 transition group text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#FF5533] flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-[#FF5533] block leading-tight">
                      Create Flatmate Profile
                    </span>
                    <span className="text-[10px] text-stone-500">Find compatible flatmates</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Floating Search Console with 4 Attached Trust Badges */}
        <div ref={containerRef} className="max-w-5xl mx-auto">
          {/* Main White Rounded Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-3xl sm:rounded-[32px] p-4 sm:p-5 border border-stone-200/90 shadow-[0_12px_40px_rgb(0,0,0,0.08)] grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            {/* Slot 1: I'm looking for */}
            <div className="md:col-span-4 relative pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-stone-200/80 pb-2.5 md:pb-0">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400 pl-3 mb-0.5">
                I&apos;m looking for
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-9 pr-7 py-2 bg-transparent text-sm font-bold text-stone-900 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="any">Any (Flat, Room, PG)</option>
                  <option value="flat">Full Flat / BHK</option>
                  <option value="room">Private Single Room</option>
                  <option value="pg">PG & Co-Living</option>
                  <option value="studio">Studio Apartment</option>
                  <option value="flatmate">Flatmates</option>
                </select>
                <Home className="w-4 h-4 text-[#FF5533] absolute left-2 top-2.5" />
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Slot 2: Location */}
            <div className="md:col-span-4 relative pr-0 md:pr-4 border-b md:border-b-0 md:border-r border-stone-200/80 pb-2.5 md:pb-0">
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
                  placeholder="Mumbai (All Hubs)"
                  className="w-full pl-9 pr-7 py-2 bg-transparent text-sm font-bold text-stone-900 placeholder:text-stone-900 focus:outline-none"
                />
                <MapPin className="w-4 h-4 text-[#FF5533] absolute left-2 top-2.5" />
                {localityQuery && (
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
              </div>

              {/* Location Dropdown */}
              {localityDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] font-extrabold text-[#FF5533] uppercase tracking-wider">
                    Popular Mumbai Hubs
                  </div>
                  {filteredLocalities.map((loc) => (
                    <button
                      key={loc.slug}
                      type="button"
                      onClick={() => handleSelectLocality(loc.slug, loc.name)}
                      className="w-full text-left px-3.5 py-2 hover:bg-orange-50 flex items-center justify-between text-xs transition"
                    >
                      <span className="font-bold text-stone-800">{loc.name}</span>
                      <span className="text-[10px] text-stone-400">{loc.zone}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Slot 3: Budget */}
            <div className="md:col-span-2 relative pr-0 md:pr-2 pb-2.5 md:pb-0">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400 pl-3 mb-0.5">
                Budget
              </label>
              <div className="relative">
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full pl-3 pr-7 py-2 bg-transparent text-sm font-bold text-stone-900 focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="">Any Budget</option>
                  <option value="25000">Under ₹25k</option>
                  <option value="40000">Under ₹40k</option>
                  <option value="60000">Under ₹60k</option>
                  <option value="100000">Under ₹1 Lakh</option>
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-1 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#FF5533] hover:bg-[#EE4422] active:scale-98 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Search className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Attached Trust Strip Immediately Below Search */}
          <div className="mt-4 pt-3 border-t border-stone-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5533] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-stone-900 block leading-tight">Verified Listings</span>
                <span className="text-[10px] text-stone-500">100% genuine properties</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5533] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-stone-900 block leading-tight">Direct Contact</span>
                <span className="text-[10px] text-stone-500">Chat & connect directly</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5533] flex items-center justify-center flex-shrink-0">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-stone-900 block leading-tight">Easy Visits</span>
                <span className="text-[10px] text-stone-500">Schedule visits in minutes</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5533] flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-stone-900 block leading-tight">Trusted by Many</span>
                <span className="text-[10px] text-stone-500">Loved by thousands</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
