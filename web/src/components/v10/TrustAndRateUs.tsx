'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Award,
  Sparkles,
  Heart,
  Star,
  ArrowUpRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    iconColor: '#0F766E',
    iconBg: '#CCFBF1',
    title: '100% Secured Deposit',
    sub: 'Hassle Free & Escrow Backed',
  },
  {
    icon: MapPin,
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    title: 'Verified Location',
    sub: 'Physical Walkthrough Guaranteed',
  },
  {
    icon: Award,
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: '25k+ Top Rated',
    sub: 'Verified Homes in Mumbai & Metro India',
  },
  {
    symbol: '₹',
    symbolColor: '#0F766E',
    iconBg: '#CCFBF1',
    title: 'Best Value Guarantee',
    sub: 'Transparent Pricing For Every Lease',
  },
];

export const TrustAndRateUs: React.FC = () => {
  const [rated, setRated] = useState(false);

  return (
    <section className="py-12 sm:py-12 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-6">
        
        {/* ===================================================================
            1. LOVING THE APP EXPERIENCE? RATE US BANNER (EXACT ZOOMCAR MATCH)
            media_1789126375254.jpg
           =================================================================== */}
        <div className="bg-gradient-to-r from-[#E6FFFA] via-[#F0FDFA] to-[#F5F3FF] rounded-[22px] sm:rounded-[32px] p-6 sm:p-8 border border-[#99F6E4]/50 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <h3 className="text-lg sm:text-2xl font-black text-[#031B2A] tracking-tight">
              Loving the REHVO App experience?
            </h3>
            <p className="text-xs sm:text-sm font-medium text-[#64748B]">
              Help other Mumbai renters discover verified rental homes by sharing your feedback.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setRated(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#0F766E] hover:text-[#064E3B] tracking-wider uppercase group cursor-pointer"
              >
                <span>{rated ? 'Thank you for rating REHVO! 💚' : 'RATE US'}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side Stars & Mini Graphic */}
          <div className="flex flex-col items-center sm:items-end gap-2.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xl sm:text-2xl text-[#F59E0B] tracking-widest drop-shadow-xs">
              {'⭐⭐⭐⭐⭐'}
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-black text-[#0F766E] bg-white/80 px-2.5 sm:px-3 py-1 rounded-full border border-[#99F6E4]">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
              <span>4.9 / 5.0 on App Store &amp; Play Store</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. 4 TRUST PILLARS CONTAINER (EXACT ZOOMCAR MATCH)
            media_1789126375254.jpg
           =================================================================== */}
        <div className="bg-[#F8FAFC] rounded-[22px] sm:rounded-[32px] p-6 sm:p-8 border border-[#E2E8F0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {TRUST_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="flex items-center gap-3.5 sm:gap-4">
                  <div
                    className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: pillar.iconBg }}
                  >
                    {Icon ? (
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.4]" style={{ color: pillar.iconColor }} />
                    ) : (
                      <span className="text-xl sm:text-2xl font-black" style={{ color: pillar.symbolColor }}>
                        {pillar.symbol}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-[#031B2A] leading-snug">
                      {pillar.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#64748B] font-semibold mt-0.5">
                      {pillar.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
