'use client';

import React, { useState } from 'react';
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
  Sparkles,
} from 'lucide-react';

type SearchCategory = 'rent' | 'commercial' | 'pg-rooms' | 'flatmates';

export const PrimarySearchSection: React.FC = () => {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<SearchCategory>('rent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Mumbai');
  const [selectedBudget, setSelectedBudget] = useState('Any Budget');

  const categories: { id: SearchCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'rent', label: 'Rent', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building },
    { id: 'pg-rooms', label: 'PG & Rooms', icon: BedDouble },
    { id: 'flatmates', label: 'Flatmates', icon: Users },
  ];

  const popularTags = [
    { label: 'Bandra West', category: 'rent', query: 'Bandra West' },
    { label: 'Andheri West', category: 'rent', query: 'Andheri West' },
    { label: 'Powai High-Rises', category: 'rent', query: 'Powai' },
    { label: 'BKC Offices', category: 'commercial', query: 'BKC' },
    { label: 'Furnished 2 BHK', category: 'rent', query: '2 BHK' },
    { label: 'Female Flatmates', category: 'flatmates', query: 'Female' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('query', searchQuery.trim());
    if (selectedLocation !== 'All Mumbai') params.set('locality', selectedLocation);
    if (selectedBudget !== 'Any Budget') params.set('budget', selectedBudget);

    const qs = params.toString() ? `?${params.toString()}` : '';

    switch (activeCategory) {
      case 'rent':
        router.push(`/rent${qs}`);
        break;
      case 'commercial':
        router.push(`/commercial${qs}`);
        break;
      case 'pg-rooms':
        router.push(`/pg-rooms${qs}`);
        break;
      case 'flatmates':
        router.push(`/flatmates${qs}`);
        break;
    }
  };

  const handleTagClick = (tagCategory: string, query: string) => {
    setActiveCategory(tagCategory as SearchCategory);
    setSearchQuery(query);
    router.push(`/${tagCategory}?query=${encodeURIComponent(query)}`);
  };

  return (
    <section className="pt-8 sm:pt-12 pb-12 sm:pb-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Title & Value Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#CCFBF1] border border-[#0F766E]/20 text-[#0F766E] text-xs font-black tracking-wide uppercase mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Listing Property & Roommate Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#031B2A] tracking-tight leading-[1.12]">
            Find a place that feels right.
          </h1>

          <p className="text-base sm:text-lg font-medium text-[#64748B] mt-3 max-w-2xl mx-auto leading-relaxed">
            Homes, commercial spaces, PGs and flatmates — all in one place with verified hosts and verified marketplace fees.
          </p>
        </div>

        {/* Large Premium Search Module */}
        <div className="max-w-4xl mx-auto bg-[#FFFFFF] rounded-3xl sm:rounded-[28px] p-3.5 sm:p-5 border border-[#E2E8F0] shadow-[0_15px_40px_rgba(3, 27, 42,0.06)]">
          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F8FAFC] rounded-2xl sm:rounded-full w-full sm:w-fit mb-3 sm:mb-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl sm:rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#031B2A] text-[#FFFFFF] shadow-xs'
                      : 'text-[#64748B] hover:text-[#031B2A] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0F766E]' : 'text-[#64748B]'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Form Fields Grid */}
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            {/* Field 1: Locality / Property Query */}
            <div className="sm:col-span-5 bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0] hover:border-[#CBD5E1] transition flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-wider block">
                  Location or Society
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locality, building or area..."
                  className="w-full bg-transparent text-xs sm:text-sm font-extrabold text-[#031B2A] placeholder:text-[#64748B]/60 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Field 2: City / Suburb Zone */}
            <div className="sm:col-span-3 bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0] hover:border-[#CBD5E1] transition flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] text-[#031B2A] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-wider block">
                  Region
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-extrabold text-[#031B2A] focus:outline-hidden cursor-pointer"
                >
                  <option value="All Mumbai">All Mumbai</option>
                  <option value="Western Suburbs">Western Suburbs</option>
                  <option value="South Mumbai">South Mumbai</option>
                  <option value="Central Mumbai">Central Mumbai</option>
                  <option value="Bandra West">Bandra West</option>
                  <option value="Andheri West">Andheri West</option>
                  <option value="Powai">Powai</option>
                  <option value="Thane">Thane</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                </select>
              </div>
            </div>

            {/* Field 3: Budget Range */}
            <div className="sm:col-span-2 bg-[#F8FAFC] rounded-2xl p-3 border border-[#E2E8F0] hover:border-[#CBD5E1] transition flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] text-[#031B2A] flex items-center justify-center flex-shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-[10px] font-black text-[#64748B] uppercase tracking-wider block">
                  Budget
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-transparent text-xs font-extrabold text-[#031B2A] focus:outline-hidden cursor-pointer"
                >
                  <option value="Any Budget">Any Budget</option>
                  <option value="under-30000">Under ₹30k</option>
                  <option value="under-50000">₹30k - ₹50k</option>
                  <option value="50000-100000">₹50k - ₹1 Lakh</option>
                  <option value="above-100000">₹1 Lakh+</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full h-[52px] rounded-2xl bg-[#0F766E] hover:bg-[#064E3B] text-[#FFFFFF] font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Popular Quick Discovery Tags */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-extrabold text-[#64748B] mr-1">Popular searches:</span>
          {popularTags.map((tag) => (
            <button
              key={tag.label}
              type="button"
              onClick={() => handleTagClick(tag.category, tag.query)}
              className="px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F1F5F9] border border-[#E2E8F0] font-bold text-[#031B2A] hover:text-[#0F766E] transition shadow-2xs"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
