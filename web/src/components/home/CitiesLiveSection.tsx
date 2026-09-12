'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Building, Home, BedDouble, Users, Sparkles } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const CitiesLiveSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF6F8] text-[#4C7A86] text-[11px] font-bold uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>DESTINATION DISCOVERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight">
              Explore popular locations
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#64748B] mt-2 max-w-xl">
              Verified residences, commercial spaces, and compatible flatmates across Mumbai’s prime urban hubs.
            </p>
          </div>

          <Link
            href="/localities"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#4C7A86] hover:text-[#031B2A] group"
          >
            <span>Explore all neighbourhoods</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric Composition: 1 Large Destination (7 cols) + 2 Stacked Locations (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Large Spotlight Location: Mumbai */}
          <Link
            href="/localities"
            className="lg:col-span-7 group relative min-h-[420px] rounded-[28px] overflow-hidden bg-[#031B2A] shadow-md hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between p-6 sm:p-8 border border-[#E2E8F0]"
          >
            <RehvoImage
              src="https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=1200&auto=format&fit=crop&q=80"
              alt="Mumbai Skyline & Coastal Highway"
              fill
              fallbackCategory="locality"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/95 via-[#031B2A]/40 to-transparent pointer-events-none" />

            {/* Top Status */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 bg-[#16A34A] text-white text-[10.5px] font-black uppercase px-3 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>PRIMARY HUB • 1,200+ HOMES</span>
              </div>
              <span className="bg-white/20 backdrop-blur-xs text-white text-[10.5px] font-bold px-3 py-1 rounded-full border border-white/20">
                Verified Listing
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 space-y-3">
              <div>
                <span className="text-[11px] font-extrabold text-[#EDF6F8] tracking-wider uppercase">
                  WESTERN SUBURBS • SOUTH MUMBAI • CENTRAL
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5">
                  Mumbai
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 font-medium line-clamp-2 mt-1 leading-relaxed max-w-lg">
                  From coastal residences in Bandra & Worli to thriving commercial and tech hubs in Andheri, BKC & Powai.
                </p>
              </div>

              {/* Suburb Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/15">
                <span className="bg-white/10 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  Bandra West
                </span>
                <span className="bg-white/10 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  Andheri West
                </span>
                <span className="bg-white/10 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  Powai
                </span>
                <span className="bg-white/10 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                  Worli
                </span>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between text-xs font-black text-white group-hover:text-[#EDF6F8] transition">
                <span>Explore Mumbai Neighbourhoods</span>
                <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-[#4C7A86] flex items-center justify-center text-white transition">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Right Column: Thane + Navi Mumbai (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* 2. Thane */}
            <Link
              href="/mumbai/thane-west"
              className="group relative rounded-[24px] overflow-hidden bg-[#031B2A] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 border border-[#E2E8F0] flex-1 min-h-[190px]"
            >
              <RehvoImage
                src="https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&auto=format&fit=crop&q=80"
                alt="Thane City"
                fill
                fallbackCategory="locality"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/90 via-[#031B2A]/30 to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  450+ Active Listings
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Thane
                </h4>
                <p className="text-xs text-stone-200 font-medium line-clamp-1">
                  Ghodbunder Road, Majiwada & West townships
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-white group-hover:text-[#EDF6F8] transition">
                  <span>Explore Thane</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* 3. Navi Mumbai */}
            <Link
              href="/mumbai/vashi"
              className="group relative rounded-[24px] overflow-hidden bg-[#031B2A] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 border border-[#E2E8F0] flex-1 min-h-[190px]"
            >
              <RehvoImage
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80"
                alt="Navi Mumbai Architecture"
                fill
                fallbackCategory="locality"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/90 via-[#031B2A]/30 to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  380+ Active Listings
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Navi Mumbai
                </h4>
                <p className="text-xs text-stone-200 font-medium line-clamp-1">
                  Vashi, Kharghar, Belapur & Nerul corridors
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-bold text-white group-hover:text-[#EDF6F8] transition">
                  <span>Explore Navi Mumbai</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
