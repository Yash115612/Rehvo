'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlusCircle, Search } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#031B2A] rounded-[36px] p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl border border-stone-800">
          {/* Ambient light effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#CCFBF1]0/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-block bg-white/10 text-stone-200 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full border border-white/15">
              START TODAY · VERIFIED LISTING
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Find your next place with REHVO.
            </h2>

            <p className="text-stone-300 text-sm sm:text-base font-medium max-w-lg mx-auto">
              Join thousands of renters, property owners, and roommates connecting directly across Mumbai.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/rent"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-extrabold px-7 py-4 rounded-full shadow-lg hover:shadow-teal-800/20 transition active:scale-98"
              >
                <Search className="w-4 h-4" />
                <span>Explore Homes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/list-property"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold px-7 py-4 rounded-full border border-white/20 transition active:scale-98"
              >
                <PlusCircle className="w-4 h-4 text-[#0F766E]" />
                <span>List Your Property</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
