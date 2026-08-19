'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, Users, Home, ArrowRight, X, Check, Wallet, SlidersHorizontal } from 'lucide-react';
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
    <div ref={containerRef} className="w-full max-w-4xl mx-auto my-6 relative z-30">
      {/* Category Segmented Control Pills */}
      <div className="flex items-center justify-center sm:justify-start gap-1 p-1 bg-stone-900/40 backdrop-blur-md rounded-full w-fit mx-auto sm:mx-0 mb-3 border border-white/10 shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'all'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>All</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flat')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'flat'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Flats</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('room')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'room'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Rooms</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pg')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'pg'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>PG</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flatmate')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
            activeTab === 'flatmate'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-purple-300 hover:text-white hover:bg-purple-600/30'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Flatmates</span>
        </button>
      </div>

      {/* Main Search Panel Surface */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white/95 backdrop-blur-xl rounded-3xl p-3 sm:p-4 shadow-2xl border border-stone-200/90 grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
      >
        {/* Location / Locality Input */}
        <div className="relative md:col-span-5 flex items-center border-b md:border-b-0 md:border-r border-stone-200/70 pb-3 md:pb-0 md:pr-3">
          <div className="p-2 text-stone-400">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
              Where in Mumbai?
            </label>
            <input
              type="text"
              value={localityQuery}
              onChange={(e) => {
                setLocalityQuery(e.target.value);
                setSelectedLocalitySlug('');
                setLocalityDropdownOpen(true);
              }}
              onFocus={() => setLocalityDropdownOpen(true)}
              placeholder="Search locality (e.g. Andheri, Bandra)..."
              className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 text-sm font-bold focus:outline-none"
            />
          </div>
          {localityQuery && (
            <button
              type="button"
              onClick={() => {
                setLocalityQuery('');
                setSelectedLocalitySlug('');
              }}
              className="p-1 text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {localityDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-50 divide-y divide-stone-100 max-h-64 overflow-y-auto">
              <div className="p-3 bg-stone-50 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {localityQuery.trim() ? 'Matching Localities' : 'Popular Mumbai Localities'}
              </div>
              {filteredLocalities.map((loc) => (
                <button
                  key={loc.slug}
                  type="button"
                  onClick={() => handleSelectLocality(loc.slug, loc.name)}
                  className="w-full px-4 py-2.5 text-left hover:bg-purple-50 flex items-center justify-between transition group"
                >
                  <div>
                    <span className="text-xs font-bold text-stone-900 group-hover:text-purple-700 block">
                      {loc.name}
                    </span>
                    <span className="text-[10px] text-stone-500">{loc.zone} • Zero Brokerage</span>
                  </div>
                  {selectedLocalitySlug === loc.slug && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BHK Configuration */}
        <div className="md:col-span-3 flex items-center border-b md:border-b-0 md:border-r border-stone-200/70 pb-3 md:pb-0 md:pr-3">
          <div className="flex-1 pl-2">
            <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
              Bedrooms
            </label>
            <select
              value={selectedBhk}
              onChange={(e) => setSelectedBhk(e.target.value)}
              className="w-full bg-transparent text-stone-900 text-sm font-bold focus:outline-none cursor-pointer py-0.5"
            >
              <option value="">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
        </div>

        {/* Budget Max */}
        <div className="md:col-span-2 flex items-center pb-3 md:pb-0 md:pr-2">
          <div className="flex-1 pl-2">
            <label className="block text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
              Max Rent
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full bg-transparent text-stone-900 text-sm font-bold focus:outline-none cursor-pointer py-0.5"
            >
              <option value="">Any Budget</option>
              <option value="25000">Up to ₹25,000</option>
              <option value="40000">Up to ₹40,000</option>
              <option value="60000">Up to ₹60,000</option>
              <option value="100000">Up to ₹1,00,000</option>
              <option value="200000">Up to ₹2,00,000</option>
            </select>
          </div>
        </div>

        {/* Search Submit Action Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-stone-900 hover:bg-black text-white font-bold text-xs py-3.5 px-4 rounded-2xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
