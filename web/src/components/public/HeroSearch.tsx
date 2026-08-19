'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Building,
  Users,
  Home,
  ArrowRight,
  X,
  Check,
  Wallet,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

export const HeroSearch: React.FC = () => {
  const router = useRouter();

  // Search States
  const [activeTab, setActiveTab] = useState<'all' | 'flat' | 'room' | 'pg' | 'flatmate'>('all');
  const [localityQuery, setLocalityQuery] = useState('');
  const [selectedLocalitySlug, setSelectedLocalitySlug] = useState('');
  const [selectedBhk, setSelectedBhk] = useState<string>('');
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

    if (activeTab === 'flatmate') {
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

    if (activeTab !== 'all') {
      params.set('type', activeTab);
    }

    if (selectedBhk) {
      params.set('bedrooms', selectedBhk);
    }

    if (selectedBudget) {
      params.set('maxPrice', selectedBudget);
    }

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div ref={containerRef} className="w-full relative z-30">
      {/* Category Segmented Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-900/60 backdrop-blur-xl rounded-2xl w-fit mb-3 border border-white/10 shadow-lg">
        {[
          { id: 'all', label: 'All Rentals', icon: Home },
          { id: 'flat', label: 'Flats & BHKs', icon: Building },
          { id: 'room', label: 'Single Rooms', icon: Home },
          { id: 'pg', label: 'PG / Co-Living', icon: Building },
          { id: 'flatmate', label: 'Flatmates', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white text-stone-900 shadow-md scale-[1.02]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Physical Search Surface */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white/95 backdrop-blur-2xl rounded-3xl p-3 sm:p-4 border border-stone-200/90 shadow-2xl shadow-stone-950/20 grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center"
      >
        {/* Input 1: Location Autocomplete */}
        <div className="md:col-span-5 relative">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400 pl-3 mb-0.5">
            Location in Mumbai
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
              placeholder="e.g. Bandra West, Andheri, Powai..."
              className="w-full pl-9 pr-7 py-2.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-2xl text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
            <MapPin className="w-4 h-4 text-purple-600 absolute left-3 top-3" />
            {localityQuery && (
              <button
                type="button"
                onClick={() => {
                  setLocalityQuery('');
                  setSelectedLocalitySlug('');
                }}
                className="absolute right-2.5 top-3 p-0.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location Autocomplete Dropdown */}
          {localityDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 divide-y divide-stone-50">
              <div className="px-3 py-1.5 text-[10px] font-extrabold text-purple-600 uppercase tracking-wider">
                Popular Mumbai Hubs
              </div>
              {filteredLocalities.map((loc) => (
                <button
                  key={loc.slug}
                  type="button"
                  onClick={() => handleSelectLocality(loc.slug, loc.name)}
                  className="w-full text-left px-3.5 py-2 hover:bg-purple-50 flex items-center justify-between text-xs transition group"
                >
                  <span className="font-bold text-stone-800 group-hover:text-purple-700">
                    {loc.name}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400 group-hover:text-purple-500">
                    {loc.zone}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input 2: Format / BHK Selector */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400 pl-3 mb-0.5">
            Format / Bedrooms
          </label>
          <select
            value={selectedBhk}
            onChange={(e) => setSelectedBhk(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-2xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
          >
            <option value="">Any Layout / BHK</option>
            <option value="1">1 BHK Apartment</option>
            <option value="2">2 BHK Apartment</option>
            <option value="3">3 BHK Apartment</option>
            <option value="4">4+ BHK Apartment</option>
            <option value="studio">Studio Flat / 1 RK</option>
            <option value="room">Private Single Room</option>
          </select>
        </div>

        {/* Input 3: Budget Selector */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400 pl-3 mb-0.5">
            Max Budget
          </label>
          <select
            value={selectedBudget}
            onChange={(e) => setSelectedBudget(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-2xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
          >
            <option value="">Any Budget</option>
            <option value="25000">Under ₹25k/mo</option>
            <option value="40000">Under ₹40k/mo</option>
            <option value="60000">Under ₹60k/mo</option>
            <option value="100000">Under ₹1 Lakh/mo</option>
            <option value="150000">₹1.5 Lakh+</option>
          </select>
        </div>

        {/* Search Submit Button */}
        <div className="md:col-span-2 md:pt-4">
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-lg shadow-purple-600/25 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Search className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};
