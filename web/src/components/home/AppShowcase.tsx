'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Heart,
  MessageSquare,
  CalendarCheck,
  Search,
  ArrowRight,
  MapPin,
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Send,
  User,
  Home as HomeIcon,
  Plus,
  Share2,
  Wifi,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { RehvoImage } from '@/components/ui/RehvoImage';

type ScreenType = 'home' | 'property' | 'chat';

export const AppShowcase: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate screens subtly
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveScreen((prev) => {
        if (prev === 'home') return 'property';
        if (prev === 'property') return 'chat';
        return 'home';
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const appFeatures = [
    { icon: Search, label: 'Instant Search', desc: 'Find verified flats & spaces on the go' },
    { icon: Heart, label: 'Saved Sync', desc: 'Sync your saved properties across devices' },
    { icon: MessageSquare, label: 'Direct Chat', desc: 'Real-time messaging with owners' },
    { icon: CalendarCheck, label: 'Visit Bookings', desc: 'Manage your scheduled property visits' },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200/80 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8FAFC] rounded-[36px] p-8 sm:p-12 lg:p-14 border border-stone-200/80 overflow-hidden relative shadow-sm">
          {/* Ambient background soft glow */}
          <div className="absolute top-1/2 right-12 -translate-y-1/2 w-96 h-96 bg-[#0F766E]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* LEFT CONTENT — 100% Retained layout, typography & features */}
            <div className="lg:col-span-7 z-10">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-3 py-1 rounded-full border border-[#99F6E4]/60 inline-block mb-3">
                MOBILE EXPERIENCE
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-[1.15]">
                Take REHVO with you.
              </h2>
              <p className="text-sm sm:text-base font-medium text-stone-600 mt-3 max-w-xl leading-relaxed">
                Experience seamless verified property discovery right from your pocket. Search listings, chat with verified owners, and schedule visits anywhere in Mumbai.
              </p>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                {appFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.label}
                      className="bg-white rounded-2xl p-4 sm:p-4.5 border border-stone-200/80 shadow-xs hover:border-[#99F6E4] transition flex items-start gap-3.5"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">{feat.label}</h4>
                        <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/rent"
                  className="inline-flex items-center gap-2.5 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-extrabold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition group"
                >
                  <Smartphone className="w-4 h-4 text-[#0F766E]" />
                  <span>Start on Web & Mobile</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="text-xs font-semibold text-stone-400">
                  Verified Marketplace • 100% Free for Renters
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN — REALISTIC FLAGSHIP SMARTPHONE MOCKUP */}
            <div
              className="lg:col-span-5 flex flex-col items-center justify-center relative select-none pt-4 lg:pt-0"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Interactive Screen Selector Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-full border border-stone-200/90 shadow-sm mb-4 z-20">
                {(
                  [
                    { id: 'home', label: 'Explore Feed' },
                    { id: 'property', label: 'Property Details' },
                    { id: 'chat', label: 'Owner Chat' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveScreen(tab.id)}
                    className={`px-3 py-1 text-[10px] sm:text-[11px] font-extrabold rounded-full transition-all duration-200 ${
                      activeScreen === tab.id
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Physical Smartphone Frame */}
              <div className="relative group/phone">
                {/* Outer Chassis with Titanium Border & Shadow */}
                <div
                  className="w-[292px] sm:w-[312px] h-[592px] sm:h-[624px] bg-stone-950 rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4),0_10px_25px_-5px_rgba(0,0,0,0.2)] border-2 border-stone-800/90 ring-1 ring-stone-900/60 transition-all duration-700 ease-out transform lg:rotate-[-2deg] lg:group-hover/phone:rotate-0 lg:group-hover/phone:-translate-y-2 relative"
                  style={{
                    isolation: 'isolate',
                  }}
                >
                  {/* Outer Hardware Buttons Silhouettes */}
                  {/* Action Button */}
                  <div className="absolute -left-[5px] top-[75px] w-[3px] h-[20px] bg-stone-700 rounded-l-sm" />
                  {/* Volume Up */}
                  <div className="absolute -left-[5px] top-[112px] w-[3px] h-[34px] bg-stone-700 rounded-l-sm" />
                  {/* Volume Down */}
                  <div className="absolute -left-[5px] top-[156px] w-[3px] h-[34px] bg-stone-700 rounded-l-sm" />
                  {/* Power Button */}
                  <div className="absolute -right-[5px] top-[125px] w-[3px] h-[48px] bg-stone-700 rounded-r-sm" />

                  {/* 
                    DEDICATED INNER SCREEN MASK CONTAINER
                    Exact concentric geometry: 48px outer radius - 10px bezel padding = 38px screen radius
                    Hardware clipping with webkit mask to guarantee 0px corner bleed
                  */}
                  <div
                    className="w-full h-full bg-[#F8FAFC] rounded-[38px] overflow-hidden relative flex flex-col justify-between"
                    style={{
                      WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                      maskImage: 'radial-gradient(white, black)',
                      isolation: 'isolate',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {/* PHONE STATUS BAR & DYNAMIC ISLAND */}
                    <div className="h-10 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between z-30 flex-shrink-0 border-b border-stone-100/80">
                      {/* Clock */}
                      <span className="text-[11px] font-black text-stone-900 tracking-tight">
                        9:41
                      </span>

                      {/* Dynamic Island Pill */}
                      <div className="w-[86px] h-[22px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-inner">
                        <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-blue-950/80" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#0F766E] animate-pulse" />
                      </div>

                      {/* Icons: Signal, Wifi, Battery */}
                      <div className="flex items-center gap-1.5 text-stone-900">
                        <span className="text-[9px] font-extrabold tracking-tighter">5G</span>
                        <Wifi className="w-3 h-3 text-stone-900 stroke-[2.5]" />
                        <div className="w-4 h-2 rounded-[3px] border border-stone-900 p-[0.5px] flex items-center">
                          <div className="w-full h-full bg-stone-900 rounded-[1.5px]" />
                        </div>
                      </div>
                    </div>

                    {/* APP SCREEN CONTAINER */}
                    <div className="flex-1 overflow-hidden relative bg-[#F8FAFC]">
                      
                      {/* ============================================================ */}
                      {/* SCREEN 1: REHVO HOME DISCOVERY FEED                          */}
                      {/* ============================================================ */}
                      <div
                        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
                          activeScreen === 'home'
                            ? 'opacity-100 translate-x-0 pointer-events-auto'
                            : 'opacity-0 -translate-x-6 pointer-events-none'
                        }`}
                      >
                        {/* App Top Bar */}
                        <div className="px-4 pt-2.5 pb-2 bg-white border-b border-stone-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#0F766E] text-white font-black text-sm flex items-center justify-center shadow-xs">
                              R
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-black text-stone-900 tracking-tight">REHVO</span>
                                <span className="text-[7px] font-extrabold text-[#0F766E] bg-[#CCFBF1] px-1 py-0.2 rounded border border-[#99F6E4]/50">
                                  VERIFIED LISTING
                                </span>
                              </div>
                              <p className="text-[9px] text-stone-500 font-semibold flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-[#0F766E]" />
                                Bandra West, Mumbai ▾
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <div className="w-7 h-7 rounded-full bg-stone-50 border border-stone-200/80 flex items-center justify-center relative">
                              <Bell className="w-3.5 h-3.5 text-stone-700" />
                              <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E] absolute top-1 right-1" />
                            </div>
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-[#99F6E4] relative bg-[#99F6E4]">
                              <RehvoImage
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                                alt="User Avatar"
                                fill
                                fallbackCategory="flatmate"
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Screen Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-2.5 no-scrollbar">
                          {/* Search Input Dock */}
                          <div className="bg-white rounded-xl px-3 py-2 border border-stone-200/90 shadow-2xs flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Search className="w-3.5 h-3.5 text-stone-400" />
                              <span className="text-[10px] font-medium text-stone-400">
                                Search locality, society, BHK...
                              </span>
                            </div>
                            <div className="p-1 rounded-md bg-stone-50 border border-stone-200/70">
                              <SlidersHorizontal className="w-3 h-3 text-stone-600" />
                            </div>
                          </div>

                          {/* Category Pills */}
                          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                            <span className="text-[9px] font-extrabold text-white bg-[#0F766E] px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap">
                              🏡 Rent Flats
                            </span>
                            <span className="text-[9px] font-bold text-stone-700 bg-white border border-stone-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                              🏢 Commercial
                            </span>
                            <span className="text-[9px] font-bold text-stone-700 bg-white border border-stone-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                              🛏️ PGs
                            </span>
                            <span className="text-[9px] font-bold text-stone-700 bg-white border border-stone-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                              👥 Flatmates
                            </span>
                          </div>

                          {/* Featured Verified Listing Card */}
                          <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs">
                            <div className="relative h-28 w-full bg-stone-100">
                              <RehvoImage
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                                alt="Bandra Luxury Flat"
                                fill
                                fallbackCategory="property"
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2 flex items-center gap-1">
                                <span className="bg-stone-900/90 backdrop-blur-xs text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded">
                                  VERIFIED
                                </span>
                                <span className="bg-[#0F766E] text-white text-[7px] font-black uppercase px-1.5 py-0.5 rounded">
                                  VERIFIED LISTING
                                </span>
                              </div>
                              <div className="w-6 h-6 rounded-full bg-stone-900/40 backdrop-blur-xs flex items-center justify-center absolute top-2 right-2 text-rose-400">
                                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                              </div>
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-900/85 backdrop-blur-xs text-white">
                                <span className="text-xs font-black">₹48,000</span>
                                <span className="text-[8px] text-stone-300 font-semibold">/mo</span>
                              </div>
                            </div>

                            <div className="p-2.5 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-black text-[#0F766E] uppercase tracking-wider">
                                  Pali Hill • Bandra West
                                </span>
                                <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2 h-2" /> Direct Host
                                </span>
                              </div>
                              <h4 className="text-[11px] font-extrabold text-stone-900 leading-snug line-clamp-1">
                                2 BHK Sunteck Grandeur with Sea Breeze
                              </h4>
                              <div className="flex items-center gap-2 text-[8px] text-stone-500 font-semibold pt-0.5">
                                <span>2 BHK</span>
                                <span>•</span>
                                <span>2 Baths</span>
                                <span>•</span>
                                <span>980 sq.ft</span>
                                <span>•</span>
                                <span>Furnished</span>
                              </div>
                            </div>
                          </div>

                          {/* Secondary Compact Card */}
                          <div className="bg-white rounded-xl p-2 border border-stone-200/90 shadow-2xs flex items-center gap-2.5">
                            <div className="w-14 h-14 rounded-lg bg-stone-100 relative overflow-hidden flex-shrink-0">
                              <RehvoImage
                                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&auto=format&fit=crop&q=80"
                                alt="Andheri Modern Flat"
                                fill
                                fallbackCategory="property"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] font-bold text-[#0F766E]">Andheri West</span>
                              <h5 className="text-[10px] font-bold text-stone-900 truncate">1 BHK Modern Garden Suite</h5>
                              <p className="text-[10px] font-black text-stone-900">₹32,000<span className="text-[7px] font-normal text-stone-500">/mo</span></p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                          </div>
                        </div>
                      </div>

                      {/* ============================================================ */}
                      {/* SCREEN 2: VERIFIED PROPERTY DETAILS                          */}
                      {/* ============================================================ */}
                      <div
                        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
                          activeScreen === 'property'
                            ? 'opacity-100 translate-x-0 pointer-events-auto'
                            : 'opacity-0 translate-x-6 pointer-events-none'
                        }`}
                      >
                        {/* Top Nav */}
                        <div className="px-3.5 py-2.5 bg-white border-b border-stone-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setActiveScreen('home')}
                            className="text-[10px] font-extrabold text-stone-700 flex items-center gap-0.5"
                          >
                            ← Back
                          </button>
                          <span className="text-[10px] font-black text-stone-900">Property Details</span>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Share2 className="w-3.5 h-3.5" />
                            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-2.5 no-scrollbar">
                          {/* Image Gallery */}
                          <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-stone-100 shadow-xs">
                            <RehvoImage
                              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80"
                              alt="Property View"
                              fill
                              fallbackCategory="property"
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <span className="bg-[#0F766E] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                                Verified Listing
                              </span>
                              <span className="bg-emerald-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              </span>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-stone-900/80 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                              1 / 8 Photos
                            </div>
                          </div>

                          {/* Title & Price */}
                          <div className="bg-white rounded-xl p-3 border border-stone-200/90 shadow-2xs space-y-1.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-sm font-black text-stone-900">₹65,000<span className="text-[9px] text-stone-500 font-semibold">/mo</span></span>
                              <span className="text-[8px] font-extrabold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded">Verified Listing</span>
                            </div>
                            <h3 className="text-xs font-black text-stone-900 leading-snug">
                              3 BHK High-Floor Sea View Penthouse
                            </h3>
                            <p className="text-[9px] text-stone-500 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-[#0F766E]" />
                              Worli Sea Face, Mumbai
                            </p>
                          </div>

                          {/* Spec Pills */}
                          <div className="grid grid-cols-3 gap-1.5 text-center">
                            <div className="bg-white p-1.5 rounded-lg border border-stone-200/80">
                              <span className="text-[7px] text-stone-400 font-bold uppercase block">Config</span>
                              <span className="text-[9px] font-black text-stone-800">3 BHK</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-stone-200/80">
                              <span className="text-[7px] text-stone-400 font-bold uppercase block">Carpet Area</span>
                              <span className="text-[9px] font-black text-stone-800">1,450 sq ft</span>
                            </div>
                            <div className="bg-white p-1.5 rounded-lg border border-stone-200/80">
                              <span className="text-[7px] text-stone-400 font-bold uppercase block">Furnishing</span>
                              <span className="text-[9px] font-black text-stone-800">Fully Furnished</span>
                            </div>
                          </div>

                          {/* Verified Owner Card */}
                          <div className="bg-[#CCFBF1]/70 rounded-xl p-2.5 border border-[#99F6E4]/70 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white font-bold text-xs flex items-center justify-center">
                                S
                              </div>
                              <div>
                                <span className="text-[10px] font-black text-stone-900 block leading-tight">Sunil Mehta</span>
                                <span className="text-[8px] text-emerald-700 font-bold flex items-center gap-0.5">
                                  <ShieldCheck className="w-2.5 h-2.5" /> Direct Owner • Fast Response
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action Dock */}
                        <div className="p-2.5 bg-white border-t border-stone-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveScreen('chat')}
                            className="flex-1 py-2 bg-stone-900 hover:bg-black text-white text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
                          >
                            <MessageSquare className="w-3 h-3 text-[#0F766E]" />
                            <span>Chat with Owner</span>
                          </button>
                          <button
                            type="button"
                            className="flex-1 py-2 bg-[#0F766E] hover:bg-[#064E3B] text-white text-[10px] font-extrabold rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
                          >
                            <CalendarCheck className="w-3 h-3 text-white" />
                            <span>Schedule Visit</span>
                          </button>
                        </div>
                      </div>

                      {/* ============================================================ */}
                      {/* SCREEN 3: DIRECT REAL-TIME OWNER CHAT                        */}
                      {/* ============================================================ */}
                      <div
                        className={`absolute inset-0 flex flex-col transition-all duration-500 ease-in-out ${
                          activeScreen === 'chat'
                            ? 'opacity-100 translate-x-0 pointer-events-auto'
                            : 'opacity-0 translate-x-6 pointer-events-none'
                        }`}
                      >
                        {/* Chat Header */}
                        <div className="px-3.5 py-2.5 bg-white border-b border-stone-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveScreen('home')}
                              className="text-stone-700 text-xs font-extrabold"
                            >
                              ←
                            </button>
                            <div className="relative">
                              <div className="w-7 h-7 rounded-full bg-[#99F6E4] border border-[#99F6E4] flex items-center justify-center font-bold text-xs text-[#0F766E]">
                                K
                              </div>
                              <div className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute bottom-0 right-0" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-black text-stone-900">Kavita Rao</span>
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              </div>
                              <p className="text-[7px] font-bold text-stone-400">Owner • Bandra West 2 BHK</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[8px] font-extrabold text-[#0F766E] bg-[#CCFBF1] px-1.5 py-0.5 rounded border border-[#99F6E4]/60">
                              Verified Listing
                            </span>
                          </div>
                        </div>

                        {/* Pinned Property Banner */}
                        <div className="px-3 py-1.5 bg-[#F8FAFC] border-b border-stone-200/60 flex items-center justify-between text-[8px]">
                          <span className="font-extrabold text-stone-700 truncate max-w-[170px]">
                            📍 2 BHK Sunteck Signature • ₹48k/mo
                          </span>
                          <span className="font-bold text-[#0F766E] flex items-center gap-0.5">
                            Active Listing →
                          </span>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar bg-[#F8FAFC]/50">
                          {/* Owner Message 1 */}
                          <div className="flex items-start gap-1.5 max-w-[85%]">
                            <div className="w-5 h-5 rounded-full bg-[#99F6E4] text-[#0F766E] font-bold text-[8px] flex items-center justify-center flex-shrink-0 mt-1">
                              K
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-xs p-2.5 border border-stone-200/80 shadow-2xs">
                              <p className="text-[9px] text-stone-800 leading-relaxed font-medium">
                                Hi Yash! Yes, the 2 BHK in Bandra West is vacant and ready for immediate possession.
                              </p>
                              <span className="text-[7px] text-stone-400 font-semibold block text-right mt-1">10:14 AM</span>
                            </div>
                          </div>

                          {/* Renter Message 1 */}
                          <div className="flex items-end justify-end ml-auto max-w-[85%]">
                            <div className="bg-stone-900 text-white rounded-2xl rounded-tr-xs p-2.5 shadow-2xs">
                              <p className="text-[9px] text-white leading-relaxed font-medium">
                                Perfect! Can I schedule a physical visit this Saturday at 11:30 AM?
                              </p>
                              <span className="text-[7px] text-stone-400 font-semibold block text-right mt-1">10:15 AM ✓✓</span>
                            </div>
                          </div>

                          {/* Owner Message 2 (Confirmed) */}
                          <div className="flex items-start gap-1.5 max-w-[85%]">
                            <div className="w-5 h-5 rounded-full bg-[#99F6E4] text-[#0F766E] font-bold text-[8px] flex items-center justify-center flex-shrink-0 mt-1">
                              K
                            </div>
                            <div className="bg-emerald-50 rounded-2xl rounded-tl-xs p-2.5 border border-emerald-200/80 shadow-2xs">
                              <div className="flex items-center gap-1 text-emerald-800 font-bold text-[9px] mb-0.5">
                                <CalendarCheck className="w-3 h-3 text-emerald-600" />
                                <span>Visit Confirmed for Saturday!</span>
                              </div>
                              <p className="text-[9px] text-stone-700 leading-relaxed">
                                Saturday 11:30 AM works great. Direct keys are with me, verified marketplace fee. See you!
                              </p>
                              <span className="text-[7px] text-emerald-600/80 font-semibold block text-right mt-1">10:16 AM</span>
                            </div>
                          </div>
                        </div>

                        {/* Chat Input Dock */}
                        <div className="p-2 bg-white border-t border-stone-100 flex items-center gap-1.5">
                          <div className="flex-1 bg-stone-100 rounded-full px-3 py-1.5 text-[9px] text-stone-400 font-medium">
                            Type a message to owner...
                          </div>
                          <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-xs">
                            <Send className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PHONE FLOATING BOTTOM TAB BAR */}
                    <div className="h-12 bg-white/95 backdrop-blur-md border-t border-stone-100/90 px-4 flex items-center justify-between z-30 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveScreen('home')}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <HomeIcon className={`w-3.5 h-3.5 ${activeScreen === 'home' ? 'text-[#0F766E]' : 'text-stone-400'}`} />
                        <span className={`text-[7px] font-extrabold ${activeScreen === 'home' ? 'text-[#0F766E]' : 'text-stone-400'}`}>
                          Home
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveScreen('property')}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <Search className={`w-3.5 h-3.5 ${activeScreen === 'property' ? 'text-[#0F766E]' : 'text-stone-400'}`} />
                        <span className={`text-[7px] font-extrabold ${activeScreen === 'property' ? 'text-[#0F766E]' : 'text-stone-400'}`}>
                          Search
                        </span>
                      </button>

                      {/* Floating Add Center Button */}
                      <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-xs -mt-1.5 border-2 border-white">
                        <Plus className="w-4 h-4 stroke-[3]" />
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveScreen('chat')}
                        className="flex flex-col items-center gap-0.5"
                      >
                        <MessageSquare className={`w-3.5 h-3.5 ${activeScreen === 'chat' ? 'text-[#0F766E]' : 'text-stone-400'}`} />
                        <span className={`text-[7px] font-extrabold ${activeScreen === 'chat' ? 'text-[#0F766E]' : 'text-stone-400'}`}>
                          Chat
                        </span>
                      </button>

                      <div className="flex flex-col items-center gap-0.5">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-[7px] font-extrabold text-stone-400">
                          Profile
                        </span>
                      </div>
                    </div>

                    {/* Bottom Home Indicator Bar */}
                    <div className="h-3.5 bg-white flex items-center justify-center flex-shrink-0">
                      <div className="w-24 h-1 bg-stone-900 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Interactive hint beneath device */}
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] font-extrabold text-stone-400">
                  <Sparkles className="w-3 h-3 text-[#0F766E]" />
                  <span>Interactive Live REHVO Mobile Interface</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
