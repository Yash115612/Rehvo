'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PublicFlatmate } from '@/lib/seo/types';
import { FlatmateProfileCard } from './FlatmateProfileCard';

interface RecommendedMatchesProps {
  flatmates: PublicFlatmate[];
  onSayHi: (flatmate: PublicFlatmate) => void;
}

export const RecommendedMatches: React.FC<RecommendedMatchesProps> = ({ flatmates, onSayHi }) => {
  if (flatmates.length === 0) return null;

  return (
    <section className="space-y-4 pt-2">
      <div className="flex items-end justify-between border-b border-stone-200/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1 text-[11px] font-black text-[#3C8D68] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Matches</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
            Recommended for you
          </h2>
          <p className="text-xs text-[#64748B] font-semibold mt-0.5">
            People who match your location, budget and lifestyle.
          </p>
        </div>

        <Link
          href="/download"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-[#3C8D68] hover:text-[#2d6b4f] transition"
        >
          <span>Create Your Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {flatmates.slice(0, 4).map((flatmate) => (
          <FlatmateProfileCard key={flatmate.id} flatmate={flatmate} onSayHi={onSayHi} />
        ))}
      </div>
    </section>
  );
};
