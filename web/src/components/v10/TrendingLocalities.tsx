'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  TrendingUp,
  Building,
  Sparkles,
  Compass,
} from 'lucide-react';

interface LocalityHub {
  name: string;
  zone: 'Western Suburbs' | 'South Mumbai & BKC' | 'Central & Tech';
  count: number;
  avgRent: string;
  tag: string;
  tagColor: string;
  href: string;
}

const LOCALITIES: LocalityHub[] = [
  {
    name: 'Bandra West',
    zone: 'Western Suburbs',
    count: 142,
    avgRent: '₹68,000/mo',
    tag: '🔥 Top Searched',
    tagColor: 'bg-[#FEF3C7] text-[#B45309]',
    href: '/search?locality=bandra-west',
  },
  {
    name: 'BKC & Bandra East',
    zone: 'South Mumbai & BKC',
    count: 88,
    avgRent: '₹75,000/mo',
    tag: '⚡ Financial Hub',
    tagColor: 'bg-[#CCFBF1] text-[#064E3B]',
    href: '/search?locality=bkc',
  },
  {
    name: 'Powai Hiranandani',
    zone: 'Central & Tech',
    count: 112,
    avgRent: '₹52,000/mo',
    tag: '🌿 Lakeside Living',
    tagColor: 'bg-[#ECFDF5] text-[#047857]',
    href: '/search?locality=powai',
  },
  {
    name: 'Andheri West',
    zone: 'Western Suburbs',
    count: 215,
    avgRent: '₹48,000/mo',
    tag: '🚇 Metro Hub',
    tagColor: 'bg-[#EFF6FF] text-[#1D4ED8]',
    href: '/search?locality=andheri-west',
  },
  {
    name: 'Worli & Lower Parel',
    zone: 'South Mumbai & BKC',
    count: 96,
    avgRent: '₹95,000/mo',
    tag: '🌟 Luxury Towers',
    tagColor: 'bg-[#FAF5FF] text-[#7E22CE]',
    href: '/search?locality=worli',
  },
  {
    name: 'Juhu & Vile Parle',
    zone: 'Western Suburbs',
    count: 74,
    avgRent: '₹82,000/mo',
    tag: '🌊 Beachside',
    tagColor: 'bg-[#F0FDFA] text-[#0F766E]',
    href: '/search?locality=juhu',
  },
  {
    name: 'Khar West',
    zone: 'Western Suburbs',
    count: 68,
    avgRent: '₹62,000/mo',
    tag: '☕ Quiet Cafes',
    tagColor: 'bg-[#FEF2F2] text-[#B91C1C]',
    href: '/search?locality=khar-west',
  },
  {
    name: 'Thane West & Ghodbunder',
    zone: 'Central & Tech',
    count: 190,
    avgRent: '₹32,000/mo',
    tag: '🏊 Gated Townships',
    tagColor: 'bg-[#F0FDF4] text-[#15803D]',
    href: '/search?locality=thane',
  },
];

const ZONES = ['All Hubs', 'Western Suburbs', 'South Mumbai & BKC', 'Central & Tech'] as const;

export const TrendingLocalities: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>('All Hubs');

  const filteredLocalities =
    activeZone === 'All Hubs'
      ? LOCALITIES
      : LOCALITIES.filter((loc) => loc.zone === activeZone);

  return (
    <section className="py-10 sm:py-14 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-black uppercase tracking-wider">
                📍 HIGH DEMAND
              </span>
              <span className="text-[11px] font-bold text-[#64748B]">MUMBAI RENTAL INDEX</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight">
              Trending Localities in Mumbai
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
              High-demand clusters with highest owner verification velocity and verified listings
            </p>
          </div>

          <Link
            href="/search"
            className="text-xs sm:text-sm font-black text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 group transition w-fit"
          >
            <span>Explore All 24+ Localities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Zone Selector Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {ZONES.map((zone) => (
            <button
              key={zone}
              type="button"
              onClick={() => setActiveZone(zone)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition cursor-pointer ${
                activeZone === zone
                  ? 'bg-[#0F766E] text-white shadow-2xs'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#031B2A] border border-[#E2E8F0]'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        {/* Responsive Locality Cards Grid (Mobile 2-col, Tablet 2-col, Desktop 4-col) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredLocalities.map((loc) => (
            <Link
              key={loc.name}
              href={loc.href}
              className="group bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 border border-[#E2E8F0] hover:border-[#0F766E]/50 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#CCFBF1] text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${loc.tagColor}`}>
                    {loc.tag}
                  </span>
                </div>

                {/* Locality Name & Suburb */}
                <h3 className="text-base sm:text-lg font-black text-[#031B2A] group-hover:text-[#0F766E] transition-colors leading-snug">
                  {loc.name}
                </h3>
                <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
                  {loc.zone}
                </p>

                {/* Available Count */}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#475569]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>{loc.count} verified homes</span>
                </div>
              </div>

              {/* Bottom Row: Avg Rent Benchmark & Arrow */}
              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <div>
                  <span className="block text-[9.5px] font-bold uppercase text-[#94A3B8]">Avg. Rent</span>
                  <span className="font-extrabold text-[#031B2A] group-hover:text-[#0F766E] transition-colors">
                    {loc.avgRent}
                  </span>
                </div>

                <span className="font-black text-[#0F766E] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Browse <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Micro-market Tag Links */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-[#64748B] mr-1">Popular Micro-Markets:</span>
          {[
            { label: 'Goregaon East', href: '/search?locality=goregaon-east' },
            { label: 'Santacruz West', href: '/search?locality=santacruz-west' },
            { label: 'Malad West', href: '/search?locality=malad-west' },
            { label: 'Vashi Navi Mumbai', href: '/search?locality=vashi' },
            { label: 'Kandivali Lokhandwala', href: '/search?locality=kandivali' },
            { label: 'Dadar & Prabhadevi', href: '/search?locality=dadar' },
          ].map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="px-3 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#F0FDFA] border border-[#E2E8F0] hover:border-[#0F766E]/40 text-[#475569] hover:text-[#0F766E] text-[11px] font-bold transition"
            >
              {tag.label}
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
