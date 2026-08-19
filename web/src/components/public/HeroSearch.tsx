'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, ArrowRight, X } from 'lucide-react';
import { MUMBAI_LOCALITIES } from '@/lib/seo/slugs';

export const HeroSearch: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const localities = Object.entries(MUMBAI_LOCALITIES).map(([slug, info]) => ({
    slug,
    name: info.name,
    zone: info.zone,
  }));

  const filteredLocalities = query.trim()
    ? localities.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.zone.toLowerCase().includes(query.toLowerCase())
      )
    : localities.slice(0, 6);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug: string) => {
    setIsOpen(false);
    router.push(`/mumbai/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredLocalities.length > 0) {
      handleSelect(filteredLocalities[0].slug);
    } else {
      router.push('/mumbai');
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto my-6 z-30">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-stone-200 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all duration-300"
      >
        <div className="pl-3 pr-2 text-stone-400">
          <Search className="w-5 h-5 text-purple-600" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search locality in Mumbai (e.g. Andheri West, Bandra, Powai)..."
          className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 text-sm font-medium focus:outline-none py-2.5"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 text-stone-400 hover:text-stone-600 transition mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-1.5 flex-shrink-0 shadow-sm"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 divide-y divide-stone-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {query.trim() ? 'Matching Localities in Mumbai' : 'Popular Neighbourhoods'}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-stone-50">
            {filteredLocalities.length > 0 ? (
              filteredLocalities.map((loc) => (
                <button
                  key={loc.slug}
                  type="button"
                  onClick={() => handleSelect(loc.slug)}
                  className="w-full px-4 py-3 text-left hover:bg-purple-50 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-stone-900 group-hover:text-purple-700 transition block">
                        {loc.name}
                      </span>
                      <span className="text-[11px] text-stone-500">{loc.zone} • Zero Brokerage</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-stone-500">
                No matching locality found. Press Search to explore all Mumbai rentals.
              </div>
            )}
          </div>

          <div className="p-3 bg-stone-50/70 flex items-center justify-between text-xs text-stone-500">
            <span>Looking for flatmates?</span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push('/flatmates/mumbai');
              }}
              className="text-purple-600 font-bold hover:underline"
            >
              Explore Flatmates →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
