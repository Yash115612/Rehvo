'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Banknote, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ZeroBrokerageBanner: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0F766E] to-[#064E3B] rounded-[32px] p-8 sm:p-12 lg:p-14 text-white shadow-card-hover relative overflow-hidden">
          {/* Subtle Ambient Shapes */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#CCFBF1]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3.5 py-1 rounded-full text-xs font-black text-[#CCFBF1] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#2DD4BF]" />
              <span>THE VERIFIED RENTAL PROMISE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              India&apos;s Verified Rental Marketplace. <br />
              Direct Owners &amp; Trusted Brokers.
            </h2>

            <p className="text-sm sm:text-base text-[#CCFBF1]/90 font-medium leading-relaxed max-w-2xl">
              REHVO connects verified renters with homeowners and registered brokers through transparent pricing, verified agreements, and AI-powered property matching.
            </p>
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: 100% Verified */}
            <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-6 border border-white/15 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-[#2DD4BF]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">100% Verified Listings</h3>
              <p className="text-xs text-[#CCFBF1]/80 leading-relaxed font-medium">
                Every listing is verified by our team. Chat directly with verified owners or trusted brokers with full transparency.
              </p>
            </div>

            {/* Pillar 2: 0 Deposit */}
            <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-6 border border-white/15 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-xl font-black text-[#D4AF37]">
                ₹0
              </div>
              <h3 className="text-lg font-black text-white">0 Deposit Options</h3>
              <p className="text-xs text-[#CCFBF1]/80 leading-relaxed font-medium">
                Select from verified properties offering zero security deposit or credit-backed monthly micro-deposits.
              </p>
            </div>

            {/* Pillar 3: AI Price Intelligence */}
            <div className="bg-white/10 backdrop-blur-md rounded-[24px] p-6 border border-white/15 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-[#2DD4BF]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">AI Price Intelligence</h3>
              <p className="text-xs text-[#CCFBF1]/80 leading-relaxed font-medium">
                Our algorithmic pricing model analyzes fair locality index rates to help you secure the best rent price.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#CCFBF1]">
              <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
              <span>Over 10,000+ verified listings across Mumbai &amp; metro cities</span>
            </div>

            <Link
              href="/search"
              className="h-11 px-6 rounded-full bg-white hover:bg-[#CCFBF1] text-[#064E3B] text-xs font-black flex items-center gap-2 shadow-md transition"
            >
              <span>Browse Verified Homes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
