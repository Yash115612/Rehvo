'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AIConciergeBanner: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#031B2A] via-[#064E3B] to-[#0F766E] rounded-[24px] sm:rounded-[32px] p-5 xs:p-6 sm:p-10 lg:p-12 text-white shadow-card-hover relative overflow-hidden">
          {/* Ambient Lighting Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CCFBF1]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Copy & CTA */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#CCFBF1] uppercase tracking-wider backdrop-blur-md max-w-full truncate">
                <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                <span className="truncate">AI CONCIERGE & DECISION ENGINE</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Find your dream rental <br />
                with a simple prompt.
              </h2>

              <p className="text-xs sm:text-base text-[#CCFBF1]/80 max-w-xl font-medium leading-relaxed">
                Tell REHVO AI what you need — from pet-friendly 2 BHKs near BKC to roommate-friendly flats under budget. Our natural language concierge matches verified listings instantly.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/ai-concierge"
                  className="h-11 sm:h-12 px-7 rounded-full bg-[#CCFBF1] hover:bg-white text-[#064E3B] text-xs font-black flex items-center justify-center gap-2 shadow-lg transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4 text-[#0F766E]" />
                  <span>Ask REHVO AI</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-[#CCFBF1]/80">
                  <CheckCircle2 className="w-4 h-4 text-[#2DD4BF]" />
                  <span>24/7 Smart Assistance</span>
                </div>
              </div>
            </div>

            {/* Right Column: Preview Conversation */}
            <div className="lg:col-span-5 space-y-3">
              {/* User Bubble */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl rounded-tr-none p-3.5 sm:p-4 border border-white/15 sm:ml-auto max-w-full sm:max-w-sm space-y-1">
                <div className="text-[10px] font-black uppercase text-[#CCFBF1]/60">You</div>
                <p className="text-xs sm:text-sm font-medium text-white">
                  &quot;Find me a furnished 2 BHK in Bandra West under ₹50k with verified owner or agent.&quot;
                </p>
              </div>

              {/* AI Bubble */}
              <div className="bg-[#031B2A]/80 backdrop-blur-lg rounded-2xl rounded-tl-none p-3.5 sm:p-4 border border-teal-500/30 max-w-full sm:max-w-sm space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#2DD4BF] uppercase">
                  <Sparkles className="w-3 h-3" />
                  <span>REHVO AI Concierge</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-white/90">
                  Found 8 verified flats matching your criteria! Top pick: Pali Hill 2 BHK with transparent pricing &amp; verified landlord.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-[#CCFBF1]">
                  <span className="bg-white/10 px-2 py-0.5 rounded-md">98% Match Score</span>
                  <span>Physical visit verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
