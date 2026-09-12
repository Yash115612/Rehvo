'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const BenefitsStrip: React.FC = () => {
  return (
    <section className="py-6 sm:py-8 bg-white border-y border-[#E2E8F0]/80">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
              Benefits
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#64748B]">
              Your active cashback, reward vouchers &amp; invite perks
            </p>
          </div>

          <Link
            href="/download"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] hover:text-[#064E3B] transition"
          >
            <span>Claim in App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Capsule Pill Cards (Exact Translation of media_1789126375254.jpg) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pill 1: R-Cash */}
          <Link
            href="/download"
            className="group bg-[#F8FAFC] hover:bg-white p-4 sm:p-5 rounded-[22px] sm:rounded-[24px] border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]/50 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                💵
              </div>
              <div>
                <div className="text-xs font-black text-[#64748B] uppercase tracking-wider">
                  R-Cash System
                </div>
                <div className="text-base sm:text-lg font-black text-[#031B2A] group-hover:text-[#0F766E] transition">
                  Earn 1% Cashback
                </div>
                <div className="text-[11px] font-medium text-[#059669]">
                  On Every Online Rent Payment
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-[#0F766E] group-hover:border-[#0F766E] transition shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Pill 2: Rewards */}
          <Link
            href="/download"
            className="group bg-[#F8FAFC] hover:bg-white p-4 sm:p-5 rounded-[22px] sm:rounded-[24px] border border-[#E2E8F0] hover:border-[#D97706]/40 hover:shadow-card-hover transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A]/50 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                🎁
              </div>
              <div>
                <div className="text-xs font-black text-[#64748B] uppercase tracking-wider">
                  Rewards Hub
                </div>
                <div className="text-base sm:text-lg font-black text-[#031B2A] group-hover:text-[#D97706] transition">
                  Up to ₹5,000 Cards
                </div>
                <div className="text-[11px] font-medium text-[#D97706]">
                  On Physical Tour Completion
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-[#D97706] group-hover:border-[#D97706] transition shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Pill 3: Share & Earn */}
          <Link
            href="/download"
            className="group bg-[#F8FAFC] hover:bg-white p-4 sm:p-5 rounded-[22px] sm:rounded-[24px] border border-[#E2E8F0] hover:border-[#16A34A]/40 hover:shadow-card-hover transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0]/50 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                👥
              </div>
              <div>
                <div className="text-xs font-black text-[#64748B] uppercase tracking-wider">
                  Share &amp; Earn
                </div>
                <div className="text-base sm:text-lg font-black text-[#031B2A] group-hover:text-[#16A34A] transition">
                  ₹300 Per Invite
                </div>
                <div className="text-[11px] font-medium text-[#16A34A]">
                  For Friend’s First Lease Sign
                </div>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:text-[#16A34A] group-hover:border-[#16A34A] transition shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
};
