'use client';

import React, { useState } from 'react';
import { Users, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';
import { FlatmateProfileCard } from './FlatmateProfileCard';

interface FlatmateDiscoveryGridProps {
  flatmates: PublicFlatmate[];
  onSayHi: (flatmate: PublicFlatmate) => void;
  onClearFilters: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SORT_OPTIONS = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Budget: Low to High', value: 'budget_asc' },
  { label: 'Budget: High to Low', value: 'budget_desc' },
  { label: 'Move-in Soon', value: 'move_in_soon' },
];

export const FlatmateDiscoveryGrid: React.FC<FlatmateDiscoveryGridProps> = ({
  flatmates,
  onSayHi,
  onClearFilters,
  sortBy,
  onSortChange,
}) => {
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil(flatmates.length / itemsPerPage) || 1;
  const paginatedFlatmates = flatmates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const currentSortLabel = SORT_OPTIONS.find((s) => s.value === sortBy)?.label || 'Recommended';

  return (
    <section className="space-y-5 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
            Discover flatmates
          </h2>
          <p className="text-xs text-[#64748B] font-semibold mt-0.5">
            {flatmates.length} active flatmate profiles across Mumbai
          </p>
        </div>

        <div className="relative self-start sm:self-auto z-20">
          <button
            type="button"
            onClick={() => setSortOpen((prev) => !prev)}
            className="h-9 px-4 rounded-full rehvo-glass-card hover:bg-white/90 text-xs font-bold text-[#031B2A] flex items-center gap-2 shadow-xs transition cursor-pointer border border-white/70"
          >
            <span className="text-[#64748B]">Sort:</span>
            <span>{currentSortLabel}</span>
            <ChevronDown className={'w-3.5 h-3.5 text-[#64748B] transition-transform ' + (sortOpen ? 'rotate-180 text-[#0F766E]' : '')} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-52 rehvo-glass-dropdown shadow-2xl p-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="space-y-0.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value);
                      setSortOpen(false);
                      setCurrentPage(1);
                    }}
                    className={'w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between text-left transition cursor-pointer ' + (sortBy === opt.value ? 'bg-white/90 text-[#031B2A] font-black' : 'text-[#031B2A] hover:bg-white/60')}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-[#3C8D68]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {flatmates.length === 0 ? (
        <div className="rehvo-glass-card rounded-[28px] p-10 sm:p-14 text-center max-w-lg mx-auto my-8 border border-white/80 space-y-4 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-[#EBF5F0] text-[#3C8D68] flex items-center justify-center mx-auto shadow-xs">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#031B2A]">No flatmates match your criteria</h3>
          <p className="text-xs text-[#64748B] font-semibold max-w-sm mx-auto leading-relaxed">
            Try broadening your budget range, changing the room preference, or clearing filters.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onClearFilters}
              className="h-10 px-6 rounded-full bg-[#031B2A] hover:bg-black text-white text-xs font-black inline-flex items-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {paginatedFlatmates.map((flatmate) => (
              <FlatmateProfileCard key={flatmate.id} flatmate={flatmate} onSayHi={onSayHi} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 pb-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-9 px-4 rounded-full rehvo-glass-card text-xs font-bold text-[#031B2A] disabled:opacity-40 transition cursor-pointer"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={'w-9 h-9 rounded-full text-xs font-black transition cursor-pointer ' + (currentPage === page ? 'bg-[#031B2A] text-white shadow-xs' : 'rehvo-glass-card text-[#031B2A] hover:bg-white')}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="h-9 px-4 rounded-full rehvo-glass-card text-xs font-bold text-[#031B2A] disabled:opacity-40 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};
