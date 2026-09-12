'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';
import { FlatmateProfileCard } from './FlatmateProfileCard';

interface NearbyFlatmatesProps {
  flatmates: PublicFlatmate[];
  onSayHi: (flatmate: PublicFlatmate) => void;
}

export const NearbyFlatmates: React.FC<NearbyFlatmatesProps> = ({ flatmates, onSayHi }) => {
  if (flatmates.length === 0) return null;

  return (
    <section className="space-y-4 pt-4">
      <div className="border-b border-stone-200/80 pb-3">
        <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#0F766E] uppercase tracking-wider mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Local Area Discovery</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
          Flatmates near you
        </h2>
        <p className="text-xs text-[#64748B] font-semibold mt-0.5">
          People looking for a place around your selected area.
        </p>
      </div>

      {/* Horizontal Rail */}
      <div className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-3 pt-1">
        {flatmates.slice(0, 6).map((flatmate) => (
          <div key={`near-${flatmate.id}`} className="w-[280px] sm:w-[320px] shrink-0">
            <FlatmateProfileCard flatmate={flatmate} onSayHi={onSayHi} />
          </div>
        ))}
      </div>
    </section>
  );
};
