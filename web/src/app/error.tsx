'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Search } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log client error safely
    console.error('Unhandled UI Exception caught by root boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[85vh] bg-[#F8FAFB] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full bg-white rounded-[32px] p-8 sm:p-12 border border-[#E2E8F0] shadow-xl text-center relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#CCFBF1]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Icon Badge */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mb-6 shadow-sm">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight mb-3">
          Something went wrong
        </h1>

        <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto mb-8 leading-relaxed">
          We encountered an unexpected display issue. Your saved homes and preferences remain safe.
          {error.digest && (
            <span className="block mt-2 font-mono text-[10px] text-slate-400">
              Error Ref: {error.digest}
            </span>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white font-bold py-3.5 px-6 rounded-full transition text-xs shadow-md shadow-emerald-900/10 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] font-bold py-3.5 px-6 rounded-full transition text-xs border border-[#CCFBF1]"
          >
            <Search className="w-4 h-4" />
            <span>Browse Rentals</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-3.5 px-6 rounded-full transition text-xs"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
