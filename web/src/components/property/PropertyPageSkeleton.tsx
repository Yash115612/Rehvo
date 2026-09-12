import React from 'react';

export const PropertyPageSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-pulse space-y-8">
      {/* Top Nav Pill Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-24 bg-white/80 rounded-full border border-[#E2E8F0]" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-white/80 rounded-full border border-[#E2E8F0]" />
          <div className="h-8 w-20 bg-white/80 rounded-full border border-[#E2E8F0]" />
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className="h-[440px] lg:h-[500px] w-full rounded-[28px] bg-white border border-[#E2E8F0] p-2 flex gap-3">
        <div className="w-2/3 h-full rounded-[22px] bg-[#F1F5F9]" />
        <div className="w-1/3 h-full flex flex-col gap-3">
          <div className="flex-1 rounded-[20px] bg-[#F1F5F9]" />
          <div className="flex-1 rounded-[20px] bg-[#F1F5F9]" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 space-y-6">
          <div className="h-28 rounded-[24px] bg-white border border-[#E2E8F0] p-6" />
          <div className="h-36 rounded-[24px] bg-white border border-[#E2E8F0] p-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-[20px] bg-white border border-[#E2E8F0]" />
            ))}
          </div>
          <div className="h-44 rounded-[24px] bg-white border border-[#E2E8F0] p-6" />
        </div>

        {/* Right 4 Cols Sticky Card Skeleton */}
        <div className="lg:col-span-4">
          <div className="h-96 rounded-[28px] bg-white border border-[#E2E8F0] p-6" />
        </div>
      </div>
    </div>
  );
};
