'use client';

import React from 'react';
import { SearchX, RotateCcw, MapPin, Sparkles } from 'lucide-react';

interface RentEmptyStateProps {
  onClearFilters: () => void;
  onSelectLocality: (loc: string) => void;
}

const POPULAR_LOCALITIES = [
  'Bandra West',
  'Andheri West',
  'Powai',
  'Worli',
  'BKC',
  'Juhu',
];

export const RentEmptyState: React.FC<RentEmptyStateProps> = ({
  onClearFilters,
  onSelectLocality,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-6 shadow-xs my-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto border border-slate-200">
        <SearchX size={32} />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h3 className="text-xl font-extrabold text-[#001741] tracking-tight">
          No matching properties found
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          We couldn&apos;t find any rental listings matching your exact combination of filters. Try widening your budget or selecting nearby localities.
        </p>
      </div>

      {/* Clear Filters CTA */}
      <div>
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#001741] hover:bg-[#0B1F3A] text-white text-xs font-bold transition shadow-sm"
        >
          <RotateCcw size={14} />
          <span>Reset All Filters</span>
        </button>
      </div>

      {/* Suggested Localities */}
      <div className="pt-4 border-t border-slate-100 max-w-lg mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Or explore popular Mumbai rental hubs:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_LOCALITIES.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => onSelectLocality(loc)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition"
            >
              <MapPin size={12} className="text-[#F97316]" />
              <span>{loc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
