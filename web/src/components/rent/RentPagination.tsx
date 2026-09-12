'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const RentPagination: React.FC<RentPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // Build page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 pt-8 pb-4">
      {/* Prev Button */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 rounded-2xl rehvo-glass-subtle text-[#031B2A] hover:bg-white/80 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs border border-white/80"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Number Buttons */}
      {pages.map((p, idx) => {
        if (typeof p === 'string') {
          return (
            <span
              key={`dots-${idx}`}
              className="w-8 h-10 flex items-center justify-center text-xs font-bold text-[#64748B]"
            >
              ...
            </span>
          );
        }

        const isCurrent = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-2xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center shadow-2xs ${
              isCurrent
                ? 'rehvo-glass-card text-[#031B2A] shadow-xs font-black -translate-y-0.5 border-white/95'
                : 'rehvo-glass-subtle text-[#64748B] hover:text-[#031B2A] hover:bg-white/70 border border-white/70'
            }`}
          >
            {p}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 rounded-2xl rehvo-glass-subtle text-[#031B2A] hover:bg-white/80 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs border border-white/80"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
