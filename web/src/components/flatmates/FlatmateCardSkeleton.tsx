'use client';

import React from 'react';

export const FlatmateCardSkeleton: React.FC = () => {
  return (
    <div className="rehvo-glass-card rounded-[24px] p-4 sm:p-5 border border-white/60 space-y-4 animate-pulse">
      {/* Portrait Skeleton */}
      <div className="w-full aspect-[4/3] rounded-[20px] bg-stone-200/80" />

      {/* Grid Pills Skeleton */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-12 rounded-xl bg-stone-200/70" />
        <div className="h-12 rounded-xl bg-stone-200/70" />
      </div>

      {/* Tags Skeleton */}
      <div className="flex gap-1.5">
        <div className="w-16 h-5 rounded-md bg-stone-200/70" />
        <div className="w-20 h-5 rounded-md bg-stone-200/70" />
        <div className="w-14 h-5 rounded-md bg-stone-200/70" />
      </div>

      {/* Match Bar Skeleton */}
      <div className="h-8 rounded-xl bg-stone-200/60" />

      {/* Buttons Skeleton */}
      <div className="flex gap-2 pt-2 border-t border-stone-200/60">
        <div className="flex-1 h-9 rounded-full bg-stone-200/70" />
        <div className="flex-1 h-9 rounded-full bg-stone-200/70" />
      </div>
    </div>
  );
};
