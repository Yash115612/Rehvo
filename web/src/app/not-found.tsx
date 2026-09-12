import React from 'react';
import Link from 'next/link';
import { Home, Search, Users, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export default function NotFound() {
  const POPULAR_LOCALITIES = [
    { name: 'Bandra West', count: '142 homes' },
    { name: 'BKC', count: '89 homes' },
    { name: 'Andheri West', count: '210 homes' },
    { name: 'Powai', count: '115 homes' },
    { name: 'Worli & Lower Parel', count: '98 homes' },
  ];

  return (
    <div className="min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full bg-white rounded-[32px] p-8 sm:p-14 border border-[#E2E8F0] shadow-xl text-center relative overflow-hidden">
        {/* Subtle Background Emerald Radial Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#CCFBF1]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0F766E]/10 rounded-full blur-3xl pointer-events-none" />

        {/* 404 Luxury Pill */}
        <div className="inline-flex items-center gap-2 text-xs font-black text-[#0F766E] bg-[#CCFBF1] px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          404 &bull; Page Not Found
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight mb-3">
          Looking for a home in the wrong place?
        </h1>

        <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto mb-8 leading-relaxed">
          The property listing, roommate profile, or page you were trying to reach may have already been rented, archived, or moved. Explore our verified Mumbai listings with verified listing.
        </p>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-10">
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white font-bold py-3.5 px-6 rounded-full transition text-xs shadow-md shadow-emerald-900/10"
          >
            <Search className="w-4 h-4" />
            <span>Search Verified Rentals</span>
          </Link>

          <Link
            href="/flatmates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F766E] font-bold py-3.5 px-6 rounded-full transition text-xs border border-emerald-200"
          >
            <Users className="w-4 h-4" />
            <span>Find Flatmates</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3.5 px-6 rounded-full transition text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Quick Localities Section */}
        <div className="pt-8 border-t border-stone-100">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
            Popular Rental Neighborhoods
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_LOCALITIES.map((loc, idx) => (
              <Link
                key={idx}
                href={`/search?q=${encodeURIComponent(loc.name)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-[#0F766E] text-xs font-medium border border-stone-200 transition"
              >
                <MapPin className="w-3 h-3 text-[#0F766E]" />
                <span>{loc.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
