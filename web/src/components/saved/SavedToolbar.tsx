'use client';

import React from 'react';
import { ArrowUpDown, Trash2 } from 'lucide-react';

interface SavedToolbarProps {
  sortBy: string;
  onSortChange: (sort: string) => void;
  onClearAll: () => void;
  totalCount: number;
}

export const SavedToolbar: React.FC<SavedToolbarProps> = ({
  sortBy,
  onSortChange,
  onClearAll,
  totalCount,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 mb-6 bg-white/50 backdrop-blur-md p-3 rounded-2xl border border-white/70 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
        <span>Showing {totalCount} saved {totalCount === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-[#031B2A] focus:outline-none cursor-pointer pr-1"
            aria-label="Sort saved items"
          >
            <option value="recent">Recently Saved</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        <div className="w-px h-4 bg-stone-300/80" />

        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear All</span>
        </button>
      </div>
    </div>
  );
};