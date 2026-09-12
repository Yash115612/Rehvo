'use client';

import React from 'react';

export const RentPropertySkeleton: React.FC = () => {
  return (
    <div className="rehvo-glass-card rounded-[24px] overflow-hidden border border-white/80 animate-pulse flex flex-col justify-between shadow-xs">
      <div>
        {/* Image Placeholder */}
        <div className="relative aspect-[16/10] w-full bg-black/5" />

        {/* Content Placeholder */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Price & Deposit Row */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-28 bg-black/10 rounded-lg" />
            <div className="h-4 w-20 bg-black/5 rounded-md" />
          </div>

          {/* Title */}
          <div className="h-5 w-4/5 bg-black/10 rounded-lg" />

          {/* Location */}
          <div className="h-3.5 w-1/2 bg-black/5 rounded-md" />

          {/* Specs Bar */}
          <div className="h-9 w-full rehvo-glass-subtle rounded-xl border border-white/70" />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 sm:px-5 pb-4 pt-2 flex items-center justify-between border-t border-white/50">
        <div className="h-4 w-24 bg-black/5 rounded-md" />
        <div className="h-4 w-20 bg-black/5 rounded-md" />
      </div>
    </div>
  );
};
