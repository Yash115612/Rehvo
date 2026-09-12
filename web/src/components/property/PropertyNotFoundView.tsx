import React from 'react';
import Link from 'next/link';
import { Home, Search, ArrowRight, Sparkles } from 'lucide-react';

export const PropertyNotFoundView: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 sm:py-32 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mx-auto shadow-sm">
        <Home className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-extrabold text-[#0F766E] uppercase tracking-wider">
          Listing Unavailable
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
          Property not found or expired
        </h1>
        <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
          The rental listing you are looking for has been rented, paused, or is no longer available on REHVO.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/rent"
          className="btn-primary text-xs py-3 px-6 rounded-2xl flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Explore Active Rentals</span>
        </Link>

        <Link
          href="/mumbai"
          className="btn-secondary text-xs py-3 px-6 rounded-2xl flex items-center gap-2"
        >
          <span>Browse Mumbai Neighborhoods</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
