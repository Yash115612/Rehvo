import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Smartphone,
  QrCode,
  Star,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  Search,
  Bell,
  Wallet,
  SlidersHorizontal,
  Heart,
  MessageSquare,
  CheckCircle2,
  Wifi,
  Users,
  Home,
  User,
} from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const DownloadAppCTA: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#031B2A] via-[#064E3B] to-[#0F766E] rounded-[24px] sm:rounded-[36px] p-5 xs:p-6 sm:p-12 lg:p-14 text-white shadow-card-hover relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFBF1]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
            {/* Left Column: Copy & Store Buttons */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#CCFBF1] uppercase tracking-wider backdrop-blur-md max-w-full truncate">
                <Smartphone className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                <span className="truncate">OFFICIAL REHVO MOBILE APP</span>
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black tracking-tight leading-[1.08]">
                Take REHVO <br />
                wherever you go.
              </h2>

              <p className="text-xs sm:text-base text-[#CCFBF1]/80 max-w-xl font-medium leading-relaxed">
                Direct verified landlord chat, scheduled physical walkthroughs, biometric society gate passes, and rental yield tracking are built for the native mobile experience.
              </p>

              {/* Download Store Buttons & QR Code */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                {/* App Store */}
                <a
                  href="#"
                  className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl bg-white text-[#031B2A] hover:bg-[#CCFBF1] transition flex items-center gap-2.5 sm:gap-3 shadow-md group"
                >
                  <span className="text-xl sm:text-2xl leading-none"></span>
                  <div className="text-left">
                    <div className="text-[8px] sm:text-[9px] font-bold text-[#64748B] uppercase leading-none">
                      Download on
                    </div>
                    <div className="text-[11px] sm:text-xs font-black leading-tight mt-0.5 group-hover:text-[#064E3B]">
                      App Store
                    </div>
                  </div>
                </a>

                {/* Google Play */}
                <a
                  href="#"
                  className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl bg-white text-[#031B2A] hover:bg-[#CCFBF1] transition flex items-center gap-2.5 sm:gap-3 shadow-md group"
                >
                  <span className="text-lg sm:text-xl leading-none">▶</span>
                  <div className="text-left">
                    <div className="text-[8px] sm:text-[9px] font-bold text-[#64748B] uppercase leading-none">
                      Get it on
                    </div>
                    <div className="text-[11px] sm:text-xs font-black leading-tight mt-0.5 group-hover:text-[#064E3B]">
                      Google Play
                    </div>
                  </div>
                </a>

                {/* QR Code Tag */}
                <div className="hidden sm:flex items-center gap-2.5 bg-white/10 px-4 py-2 rounded-2xl border border-white/15 backdrop-blur-md">
                  <QrCode className="w-7 h-7 text-[#2DD4BF]" />
                  <div className="text-[11px] font-bold text-[#CCFBF1] leading-tight">
                    Scan to <br /> Instant Install
                  </div>
                </div>
              </div>

              {/* Ratings proof */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 text-[11px] sm:text-xs font-bold text-[#CCFBF1]/80">
                <div className="flex items-center gap-1">
                  <div className="flex text-[#D4AF37]">★★★★★</div>
                  <span className="text-white ml-1">4.9 / 5.0</span>
                </div>
                <span>•</span>
                <span>50,000+ Active Renters in Mumbai</span>
              </div>
            </div>

            {/* Right Column: High-Precision Smartphone Frame Displaying Authentic REHVO App UI */}
            <div className="lg:col-span-6 flex justify-center items-center relative pt-4 sm:pt-6">
              
              {/* Floating Companion Badge 1: Direct Landlord Chat (Left Overlay) */}
              <div className="hidden sm:flex absolute -left-4 top-16 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/80 z-20 items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
                <div className="relative">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Owner Avatar"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border border-emerald-300"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1 text-[11px] font-black text-[#031B2A]">
                    <span>Rohan M. (Owner)</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  </div>
                  <p className="text-[10px] text-[#0F766E] font-bold">
                    &ldquo;Walkthrough confirmed for 5:30 PM today!&rdquo;
                  </p>
                </div>
              </div>

              {/* Floating Companion Badge 2: Digital Gate Pass (Right Overlay) */}
              <div className="hidden sm:flex absolute -right-2 bottom-16 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/80 z-20 items-center gap-2.5 animate-in fade-in slide-in-from-right duration-500">
                <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                  <QrCode className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase text-[#0F766E] tracking-wider">
                    SOCIETY GATE PASS
                  </div>
                  <div className="text-[11px] font-extrabold text-[#031B2A]">
                    Pali Hill RWA &bull; Confirmed
                  </div>
                </div>
              </div>

              {/* ================================================================
                  AUTHENTIC REHVO MOBILE APP (iPhone 16 Pro Chassis)
                 ================================================================ */}
              <div className="relative w-[285px] xs:w-[305px] sm:w-[325px] bg-[#0A1118] rounded-[48px] sm:rounded-[54px] p-2.5 sm:p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_10px_25px_-5px_rgba(0,0,0,0.4)] border-2 border-slate-700/80 ring-1 ring-white/20">
                {/* Dynamic Island Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                </div>

                {/* Screen Viewport */}
                <div className="w-full h-[580px] sm:h-[620px] bg-[#F8FAFC] rounded-[38px] sm:rounded-[42px] overflow-hidden flex flex-col justify-between relative text-[#031B2A] select-none">
                  
                  {/* Status Bar */}
                  <div className="h-9 bg-white px-6 flex items-center justify-between z-20 border-b border-slate-100 shrink-0">
                    <span className="text-[11px] font-black text-slate-900">9:41</span>
                    <div className="flex items-center gap-1.5 text-slate-900">
                      <span className="text-[9px] font-extrabold">5G</span>
                      <Wifi className="w-3 h-3 stroke-[2.5]" />
                      <div className="w-4 h-2 rounded-[3px] border border-slate-900 p-[0.5px] flex items-center">
                        <div className="w-full h-full bg-slate-900 rounded-[1.5px]" />
                      </div>
                    </div>
                  </div>

                  {/* App Screen Scrollable Area */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 p-3 pb-16">
                    
                    {/* App Header (Mirrors V4HomeScreen top header) */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Locality Selector Pill */}
                      <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        <MapPin className="w-3 h-3 text-[#0F766E]" />
                        <span className="text-[10px] font-bold text-[#031B2A] truncate max-w-[110px]">
                          Bandra West, Mumbai
                        </span>
                        <span className="text-[9px] text-slate-400">▾</span>
                      </div>

                      {/* Right Icons: Wallet & Bell */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1 bg-[#CCFBF1] px-2 py-0.5 rounded-full text-[9px] font-black text-[#064E3B]">
                          <Wallet className="w-3 h-3 text-[#0F766E]" />
                          <span>₹1,500</span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center relative shadow-2xs">
                          <Bell className="w-3.5 h-3.5 text-slate-700" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] absolute top-1 right-1" />
                        </div>
                      </div>
                    </div>

                    {/* Hero Stage Banner (Mirrors V4HomeScreen hero ad stage) */}
                    <div className="bg-gradient-to-r from-[#064E3B] via-[#0F766E] to-[#115E59] rounded-2xl p-3 text-white shadow-xs space-y-1">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[#CCFBF1] text-[8px] font-black uppercase tracking-wider backdrop-blur-md">
                        <Sparkles className="w-2.5 h-2.5 text-[#2DD4BF]" />
                        <span>100% VERIFIED MARKETPLACE</span>
                      </div>
                      <div className="text-xs font-black leading-tight">
                        Find Your Ideal Home in Mumbai
                      </div>
                      <p className="text-[9.5px] text-[#CCFBF1]/80 font-medium leading-tight">
                        0% Agent Commission &bull; Physical Walkthroughs
                      </p>
                    </div>

                    {/* Floating Search Capsule */}
                    <div className="bg-white rounded-xl px-3 py-2 border border-slate-200 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Search className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        <span className="text-[10px] font-medium text-slate-400 truncate">
                          Search 2 BHK in Bandra, Powai, BKC...
                        </span>
                      </div>
                      <div className="p-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 shrink-0">
                        <SlidersHorizontal className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Category Switcher Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                      <span className="text-[9px] font-black text-white bg-[#0F766E] px-2.5 py-1 rounded-full shadow-2xs whitespace-nowrap">
                        🏡 Flats
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                        🏢 Commercial
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                        🛏️ PGs
                      </span>
                      <span className="text-[9px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                        👥 Flatmates
                      </span>
                    </div>

                    {/* Real REHVO Property Card (Mirrors V4PropertyCard) */}
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                      {/* Image Stage */}
                      <div className="relative h-28 w-full bg-slate-100">
                        <Image
                          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                          alt="Bandra Luxury Penthouse"
                          fill
                          sizes="(max-width: 640px) 250px, 300px"
                          className="w-full h-full object-cover"
                        />
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="bg-white/95 backdrop-blur-md text-[#064E3B] text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5 text-[#10B981]" />
                            VERIFIED DIRECT
                          </span>
                          <span className="bg-[#CCFBF1]/95 text-[#064E3B] text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded shadow-xs">
                            98% Match
                          </span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center absolute top-2 right-2 shadow-xs">
                          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        </div>
                        {/* Price Overlay */}
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#031B2A]/90 backdrop-blur-xs text-white">
                          <span className="text-xs font-black">₹72,000</span>
                          <span className="text-[8px] text-slate-300 font-semibold">/mo</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-2.5 space-y-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[8.5px] font-black text-[#0F766E] uppercase tracking-wider">
                            Pali Hill &bull; Bandra West
                          </span>
                          <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-2 h-2" /> Direct Owner
                          </span>
                        </div>
                        <div className="text-[11px] font-black text-[#031B2A] leading-snug truncate">
                          2 BHK Sea-Facing Penthouse
                        </div>
                        <div className="flex items-center gap-2 text-[8.5px] text-slate-500 font-semibold pt-0.5">
                          <span>2 Beds</span>
                          <span>&bull;</span>
                          <span>2 Baths</span>
                          <span>&bull;</span>
                          <span>980 sq.ft</span>
                          <span>&bull;</span>
                          <span>Furnished</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                          <button
                            type="button"
                            className="py-1 rounded-lg bg-[#0F766E] text-white text-[9px] font-black flex items-center justify-center gap-1"
                          >
                            <span>Book Visit</span>
                          </button>
                          <button
                            type="button"
                            className="py-1 rounded-lg bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/30 text-[9px] font-bold flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-2.5 h-2.5" />
                            <span>Chat Direct</span>
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Floating Liquid Glass Bottom Navigation Bar (V4FloatingNavBar) */}
                  <div className="absolute bottom-2 left-3 right-3 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-lg py-2 px-4 flex items-center justify-between text-slate-400 z-20">
                    <div className="flex flex-col items-center gap-0.5 text-[#0F766E]">
                      <Home className="w-4 h-4 stroke-[2.4]" />
                      <span className="text-[7.5px] font-black">Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 hover:text-[#031B2A]">
                      <Search className="w-4 h-4" />
                      <span className="text-[7.5px] font-bold">Search</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 hover:text-[#031B2A] relative">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-[7.5px] font-bold">Chat</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] absolute -top-0.5 right-0.5" />
                    </div>
                    <div className="flex flex-col items-center gap-0.5 hover:text-[#031B2A]">
                      <Users className="w-4 h-4" />
                      <span className="text-[7.5px] font-bold">Flatmates</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 hover:text-[#031B2A]">
                      <User className="w-4 h-4" />
                      <span className="text-[7.5px] font-bold">Profile</span>
                    </div>
                  </div>

                  {/* iOS Home Indicator Bar */}
                  <div className="h-4 bg-transparent flex items-center justify-center z-20">
                    <div className="w-24 h-1 bg-slate-900 rounded-full" />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
