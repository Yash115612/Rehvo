'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface RentErrorStateProps {
  onRetry: () => void;
}

export const RentErrorState: React.FC<RentErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="rehvo-glass-card rounded-[28px] p-8 sm:p-12 text-center max-w-lg mx-auto my-8 shadow-sm border border-white/80">
      <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto mb-3 shadow-2xs">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="font-black text-xl text-[#031B2A] tracking-tight">
        Couldn't load rental properties
      </h3>
      <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-1 max-w-sm mx-auto">
        There was a temporary issue fetching the latest homes. Please check your connection and try again.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rehvo-glass-card text-[#031B2A] font-extrabold text-xs px-6 py-2.5 rounded-full shadow-sm transition active:scale-98 cursor-pointer hover:bg-white/80"
      >
        <RefreshCw className="w-3.5 h-3.5 text-[#0F766E]" />
        <span>Try Again</span>
      </button>
    </div>
  );
};
