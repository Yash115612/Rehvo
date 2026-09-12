'use client';

import React from 'react';
import Link from 'next/link';
import { UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CreateFlatmateCta: React.FC = () => {
  return (
    <section className="relative overflow-hidden rehvo-glass-card rounded-[32px] p-7 sm:p-10 border border-white/80 shadow-lg mt-8 mb-4">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#3C8D68]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#3C8D68] text-[11px] font-black">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join 15,000+ Roommate Seekers</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight leading-tight">
            Looking for the right flatmate?
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] font-semibold leading-relaxed">
            Create your profile in 2 minutes and get discovered by compatible roommates in Mumbai. 100% free with verified marketplace.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs font-bold text-[#031B2A]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3C8D68]" />
              Direct Chat
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3C8D68]" />
              Verified Tenants
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#3C8D68]" />
              Verified Marketplace
            </span>
          </div>
        </div>

        <Link
          href="/download"
          className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#3C8D68] hover:bg-[#2d6b4f] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg transition active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create Profile on REHVO App</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};
