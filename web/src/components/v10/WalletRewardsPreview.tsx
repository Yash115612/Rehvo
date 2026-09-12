'use client';

import React from 'react';
import Link from 'next/link';
import {
  Wallet,
  Gift,
  Coins,
  Share2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const REWARDS = [
  {
    icon: Coins,
    title: 'R-Cash System',
    desc: 'Earn 1% instant R-Cash cashback on rent payments made via the app.',
    metric: '1% Cashback',
    color: '#0F766E',
    bg: '#CCFBF1',
  },
  {
    icon: Gift,
    title: 'Digital Scratch Cards',
    desc: 'Win up to ₹5,000 on scheduling and completing verified physical visits.',
    metric: 'Up to ₹5,000',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    icon: Wallet,
    title: 'Rent Pay Cashback',
    desc: 'Credit card rent payments with 45-day interest-free cycles & zero markup.',
    metric: 'Instant Credit',
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    icon: Share2,
    title: 'Referral Rewards',
    desc: 'Invite friends or colleagues; earn ₹300 R-Cash upon their first lease agreement.',
    metric: '₹300 / Invite',
    color: '#16A34A',
    bg: '#DCFCE7',
  },
];

export const WalletRewardsPreview: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest text-[#0F766E] uppercase bg-[#CCFBF1] px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3 h-3 text-[#0F766E]" />
              <span>LOYALTY & REWARDS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Wallet Rewards Preview
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium max-w-xl">
              Pay rent, schedule visits, and invite friends to earn direct rewards inside the REHVO mobile app.
            </p>
          </div>

          <Link
            href="/download"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 group shrink-0"
          >
            <span>Activate in App</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REWARDS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] hover:bg-white rounded-[28px] p-6 border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: item.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span className="text-[10px] font-black text-[#0F766E] bg-[#CCFBF1] px-2.5 py-1 rounded-full">
                      {item.metric}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#031B2A] mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#E2E8F0]">
                  <Link
                    href="/download"
                    className="text-xs font-bold text-[#0F766E] flex items-center gap-1 group"
                  >
                    <span>Download to Redeem</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
