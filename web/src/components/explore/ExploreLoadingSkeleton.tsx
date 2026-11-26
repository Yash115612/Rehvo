'use client';

import React from 'react';

interface ExploreLoadingSkeletonProps {
  viewMode?: 'grid' | 'list';
  count?: number;
}

export const ExploreLoadingSkeleton: React.FC<ExploreLoadingSkeletonProps> = ({
  viewMode = 'grid',
  count = 6,
}) => {
  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
          : 'space-y-4'
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse shadow-xs flex ${
            viewMode === 'list' ? 'flex-col md:flex-row' : 'flex-col'
          }`}
        >
          {/* Photo Shimmer */}
          <div
            className={`bg-slate-100 ${
              viewMode === 'list'
                ? 'w-full md:w-80 h-56 md:h-auto shrink-0'
                : 'aspect-[16/10] w-full'
            }`}
          />

          {/* Info Shimmer */}
          <div className="p-4 sm:p-5 flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-6 w-28 bg-slate-200 rounded-lg" />
              <div className="h-4 w-20 bg-slate-100 rounded-md" />
            </div>

            <div className="h-4 w-4/5 bg-slate-200 rounded-md" />
            <div className="h-3 w-1/2 bg-slate-100 rounded-md" />

            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="h-7 bg-slate-100 rounded-lg" />
              <div className="h-7 bg-slate-100 rounded-lg" />
              <div className="h-7 bg-slate-100 rounded-lg" />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-100 rounded-md" />
              <div className="h-4 w-20 bg-slate-200 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
