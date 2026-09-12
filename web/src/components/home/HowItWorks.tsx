'use client';

import React from 'react';
import { Search, Compass, MessageSquare, KeyRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'Filter by flats, commercial spaces, PGs, or flatmate matches across Mumbai neighbourhoods.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Explore',
      desc: 'Inspect genuine photos, carpet areas, furnishing specs, and transparent verified rents.',
      icon: Compass,
    },
    {
      num: '03',
      title: 'Connect',
      desc: 'Chat directly with verified property owners and compatible roommates with complete privacy.',
      icon: MessageSquare,
    },
    {
      num: '04',
      title: 'Visit & Move',
      desc: 'Book physical visit appointments online, confirm agreement terms, and move into your space.',
      icon: KeyRound,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-stone-200/80">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 inline-block mb-1.5">
              SEAMLESS EXPERIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              How REHVO Works
            </h2>
            <p className="text-sm font-medium text-stone-500 mt-1">
              Four simple steps from discovery to keys in hand.
            </p>
          </div>

          <Link
            href="/rent"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1 transition"
          >
            <span>Start Searching</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 hover:shadow-md transition-all duration-300 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-stone-300 group-hover:text-[#0F766E] transition">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs font-medium text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
