'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, TrendingUp } from 'lucide-react';

const LOCALITIES = [
  { name: 'Bandra West', count: 142, popular: true, href: '/search?locality=bandra-west' },
  { name: 'Andheri West', count: 215, popular: true, href: '/search?locality=andheri-west' },
  { name: 'Powai Hiranandani', count: 98, popular: true, href: '/search?locality=powai' },
  { name: 'BKC & Kurla', count: 84, popular: true, href: '/search?locality=bkc' },
  { name: 'Worli & Lower Parel', count: 112, popular: true, href: '/search?locality=worli' },
  { name: 'Juhu & Vile Parle', count: 76, popular: false, href: '/search?locality=juhu' },
  { name: 'Thane West', count: 190, popular: false, href: '/search?locality=thane' },
  { name: 'Khar West', count: 68, popular: false, href: '/search?locality=khar-west' },
  { name: 'Malad & Goregaon', count: 154, popular: false, href: '/search?locality=malad' },
];

export const TrendingLocalities: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-black uppercase tracking-wider">
                📍 POPULAR
              </span>
              <span className="text-[11px] font-bold text-[#64748B]">MUMBAI RENTAL HUBS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Trending Localities in Mumbai
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
              High-demand clusters with highest owner verification velocity and verified listings
            </p>
          </div>

          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#064E3B] transition"
          >
            <span>Explore All Localities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Scrollable / Responsive Locality Chips (Exact Translation of V4HomeScreen.tsx) */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          {LOCALITIES.map((loc) => (
            <Link
              key={loc.name}
              href={loc.href}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F0FDFA] border border-[#E2E8F0] hover:border-[#0F766E] text-xs font-black text-[#031B2A] hover:text-[#0F766E] transition shadow-2xs group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{loc.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-white group-hover:bg-[#CCFBF1] text-[#64748B] group-hover:text-[#064E3B] text-[10px] font-bold border border-[#E2E8F0] group-hover:border-[#0F766E]/30 transition">
                {loc.count}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
