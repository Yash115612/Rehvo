'use client';

import React from 'react';
import { Home, RefreshCw, MapPin } from 'lucide-react';

interface RentEmptyStateProps {
  onClearFilters: () => void;
  onSelectLocality?: (locality: string) => void;
}

const POPULAR_AREAS = [
  'Bandra West',
  'Andheri West',
  'Powai',
  'Worli',
  'Juhu',
  'Thane',
  'Navi Mumbai',
];

export const RentEmptyState: React.FC<RentEmptyStateProps> = ({
  onClearFilters,
  onSelectLocality,
}) => {
  return (
    <div className="rehvo-glass-card rounded-[28px] p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-sm border border-white/80">
      <div className="w-14 h-14 rounded-2xl rehvo-glass-subtle text-[#0F766E] flex items-center justify-center mx-auto mb-4 font-black shadow-2xs">
        <Home className="w-7 h-7" />
      </div>

      <h3 className="font-black text-xl sm:text-2xl text-[#031B2A] tracking-tight">
        No homes match your exact criteria
      </h3>
      <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-1.5 max-w-md mx-auto leading-relaxed">
        Try broadening your budget range, changing the BHK configuration, or searching across a different Mumbai neighbourhood.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 rehvo-glass-coral text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-sm transition active:scale-98 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>

      {/* Popular Areas Quick Links */}
      {onSelectLocality && (
        <div className="mt-8 pt-6 border-t border-white/60">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#64748B] mb-3">
            Or browse top rental hubs
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_AREAS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => onSelectLocality(area)}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-[#031B2A] hover:bg-white/70 shadow-2xs border border-white/70 transition cursor-pointer"
              >
                <MapPin className="w-3 h-3 text-[#0F766E]" />
                <span>{area}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
