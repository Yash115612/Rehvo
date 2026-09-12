'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Compass } from 'lucide-react';

interface SavedHeaderProps {
  totalCount: number;
}

export const SavedHeader: React.FC<SavedHeaderProps> = ({ totalCount }) => {
  return (
    <div className="relative w-full rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 rehvo-glass-hero border border-white/80 shadow-sm overflow-hidden mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/90 text-rose-600 text-[11px] font-black tracking-wide border border-rose-200/60 shadow-2xs">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>SAVED COLLECTION • VERIFIED LISTING</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight">
            Your Saved Spaces & Roommates
          </h1>

          <p className="text-xs sm:text-sm text-[#64748B] font-semibold max-w-xl">
            Review your shortlisted apartments, rooms, and compatible flatmates. Compare options, schedule visits, and chat directly.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <div className="bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/90 shadow-2xs text-center">
            <span className="block text-[10px] font-black text-[#64748B] uppercase tracking-wider">
              Total Saved
            </span>
            <span className="text-lg font-black text-[#031B2A]">
              {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          <Link
            href="/rent"
            className="h-11 px-5 rounded-full bg-[#031B2A] hover:bg-black text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#0F766E]" />
            <span>Explore More</span>
          </Link>
        </div>
      </div>
    </div>
  );
};