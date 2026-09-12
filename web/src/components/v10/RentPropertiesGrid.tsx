'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  BedDouble,
  Store,
  Crown,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useHeroTheme } from '@/components/v10/HeroThemeContext';

const QUICK_CATEGORY_CHIPS = [
  { id: 'villas', label: 'Luxury Villas & Penthouses', icon: Crown, href: '/search?category=residential&type=villa', color: '#D97706', bg: '#FEF3C7' },
  { id: 'flatmates', label: 'VibeMatch Flatmates', icon: Users, href: '/flatmates', color: '#0F766E', bg: '#CCFBF1' },
  { id: 'studio', label: '1 RK / Studio Flats', icon: Layers, href: '/search?category=residential&type=studio', color: '#4F46E5', bg: '#EEF2FF' },
];

export const RentPropertiesGrid: React.FC = () => {
  const { currentCardTheme } = useHeroTheme();
  const { tallCard, pgCard, commercialCard } = currentCardTheme;

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header (Mirrors V4HomeScreen.tsx SectionHeader) */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black uppercase tracking-wider">
                VERIFIED MARKETPLACE
              </span>
              <span className="text-[11px] font-bold text-[#64748B]">OWNERS &amp; BROKERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight">
              Rent Properties
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
              Verified properties from direct homeowners, registered brokers, and builders with full transparency
            </p>
          </div>

          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F8FAFC] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#E2E8F0] hover:border-[#0F766E] text-xs font-bold transition group"
          >
            <span>See All Listings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ===================================================================
            ASYMMETRIC 3-CARD CATEGORY GRID (DYNAMIC THEMES SYNCED WITH HERO SLIDES)
            category_cards_design_1788878935492.jpg & media_1789126344585.jpg
           =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* CARD 1 (TALL LEFT): Dynamic Luxury Property for Rent */}
          <Link
            href="/search?category=residential"
            className="lg:col-span-7 rounded-[28px] sm:rounded-[36px] p-5 sm:p-9 flex flex-col justify-between relative overflow-hidden transition-all duration-700 ease-in-out hover:-translate-y-1 min-h-[340px] sm:min-h-[440px] group cursor-pointer border"
            style={{
              background: tallCard.gradient,
              borderColor: tallCard.borderColor,
              boxShadow: tallCard.shadow,
            }}
          >
            {/* Soft Ambient Inner Glow */}
            <div
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ease-in-out"
              style={{ backgroundColor: tallCard.glowColor }}
            />

            <div className="relative z-10">
              {/* Dynamic Tag Pill */}
              <div
                className="px-3.5 py-1 rounded-full text-[10.5px] font-black tracking-[0.8px] uppercase w-fit transition-colors duration-700 ease-in-out shadow-xs"
                style={{ backgroundColor: tallCard.tagBg, color: tallCard.tagColor }}
              >
                {tallCard.tagText}
              </div>

              {/* Title & Subtitle */}
              <h3
                className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mt-3 mb-1.5 transition-colors duration-700 ease-in-out"
                style={{ color: tallCard.titleColor || '#031B2A' }}
              >
                Property<br />for Rent
              </h3>
              <p
                className="text-xs sm:text-sm font-semibold transition-colors duration-700 ease-in-out"
                style={{ color: tallCard.subtextColor }}
              >
                1, 2, 3+ BHK &bull; Owner &amp; Broker Verified
              </p>

              {/* Centered Large Circular Glowing Icon Badge */}
              <div className="py-6 sm:py-12 flex items-center justify-center relative">
                {/* Soft ambient background glow */}
                <div
                  className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-2xl pointer-events-none transition-colors duration-700 ease-in-out opacity-40"
                  style={{ backgroundColor: tallCard.glowColor }}
                />
                
                {/* Pure White Circular Icon Disc with Subtle Elevation */}
                <div className="relative w-24 h-24 sm:w-36 sm:h-36 rounded-full bg-white border border-white/90 shadow-[0_10px_32px_rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Building2
                    className="w-12 h-12 sm:w-18 sm:h-18 stroke-[2.2] transition-colors duration-700 ease-in-out"
                    style={{ color: tallCard.iconColor }}
                  />
                </div>
              </div>
            </div>

            {/* Contrast Accent Pill CTA Button */}
            <div
              className="relative z-10 self-start px-6 py-2.5 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 shadow-md group-hover:scale-105 active:scale-95 transition-all duration-300"
              style={{ backgroundColor: tallCard.ctaBg, color: tallCard.ctaColor }}
            >
              <span>Explore</span>
              <ArrowRight
                className="w-3.5 h-3.5 transition-colors duration-700 ease-in-out"
                style={{ color: tallCard.ctaColor }}
              />
            </div>
          </Link>

          {/* ===================================================================
              RIGHT STACK: PG & Hostel (Top) + Commercial & Office (Bottom)
             =================================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
            
            {/* CARD 2 (COMPACT TOP): Dynamic PG & Hostel */}
            <Link
              href="/pg"
              className="flex-1 rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 flex items-center justify-between transition-all duration-700 ease-in-out hover:-translate-y-1 group min-h-[160px] sm:min-h-[205px] border relative overflow-hidden"
              style={{
                background: pgCard.gradient,
                borderColor: pgCard.borderColor,
                boxShadow: pgCard.shadow,
              }}
            >
              {/* Ambient Corner Glow */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl pointer-events-none transition-colors duration-700 ease-in-out opacity-30"
                style={{ backgroundColor: pgCard.glowColor }}
              />

              <div className="relative z-10">
                <div
                  className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.8px] uppercase w-fit mb-2.5 transition-colors duration-700 ease-in-out shadow-xs"
                  style={{ backgroundColor: pgCard.tagBg, color: pgCard.tagColor }}
                >
                  {pgCard.tagText}
                </div>
                <h3
                  className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight transition-colors duration-700 ease-in-out"
                  style={{ color: pgCard.titleColor || '#031B2A' }}
                >
                  PG &amp;<br />Hostel
                </h3>
                <p
                  className="text-xs sm:text-sm font-semibold mt-1.5 transition-colors duration-700 ease-in-out"
                  style={{ color: pgCard.subtextColor }}
                >
                  Furnished &bull; Shared Room
                </p>
              </div>

              {/* Glowing White Squircle Badge */}
              <div className="relative shrink-0 z-10">
                <div
                  className="absolute -inset-2 rounded-3xl blur-xl pointer-events-none transition-colors duration-700 ease-in-out opacity-40"
                  style={{ backgroundColor: pgCard.glowColor }}
                />
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[26px] bg-white border border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <BedDouble
                    className="w-8 h-8 sm:w-12 sm:h-12 stroke-[2.2] transition-colors duration-700 ease-in-out"
                    style={{ color: pgCard.iconColor }}
                  />
                </div>
              </div>
            </Link>

            {/* CARD 3 (COMPACT BOTTOM): Dynamic Commercial & Office */}
            <Link
              href="/commercial"
              className="flex-1 rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 flex items-center justify-between transition-all duration-700 ease-in-out hover:-translate-y-1 group min-h-[160px] sm:min-h-[205px] border relative overflow-hidden"
              style={{
                background: commercialCard.gradient,
                borderColor: commercialCard.borderColor,
                boxShadow: commercialCard.shadow,
              }}
            >
              {/* Ambient Corner Glow */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl pointer-events-none transition-colors duration-700 ease-in-out opacity-30"
                style={{ backgroundColor: commercialCard.glowColor }}
              />

              <div className="relative z-10">
                <div
                  className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.8px] uppercase w-fit mb-2.5 transition-colors duration-700 ease-in-out shadow-xs"
                  style={{ backgroundColor: commercialCard.tagBg, color: commercialCard.tagColor }}
                >
                  {commercialCard.tagText}
                </div>
                <h3
                  className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight transition-colors duration-700 ease-in-out"
                  style={{ color: commercialCard.titleColor || '#031B2A' }}
                >
                  Commercial<br />&amp; Office
                </h3>
                <p
                  className="text-xs sm:text-sm font-semibold mt-1.5 transition-colors duration-700 ease-in-out"
                  style={{ color: commercialCard.subtextColor }}
                >
                  Shops &bull; Workspaces
                </p>
              </div>

              {/* Glowing White Squircle Badge */}
              <div className="relative shrink-0 z-10">
                <div
                  className="absolute -inset-2 rounded-3xl blur-xl pointer-events-none transition-colors duration-700 ease-in-out opacity-40"
                  style={{ backgroundColor: commercialCard.glowColor }}
                />
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[26px] bg-white border border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Store
                    className="w-8 h-8 sm:w-12 sm:h-12 stroke-[2.2] transition-colors duration-700 ease-in-out"
                    style={{ color: commercialCard.iconColor }}
                  />
                </div>
              </div>
            </Link>

          </div>

        </div>

        {/* Complementary Quick-Access Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {QUICK_CATEGORY_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <Link
                key={chip.id}
                href={chip.href}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-xs transition text-xs font-bold text-[#031B2A] shrink-0"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: chip.bg }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: chip.color }} />
                </div>
                <span>{chip.label}</span>
                <ArrowRight className="w-3 h-3 text-[#64748B]" />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
