'use client';

import React from 'react';
import Link from 'next/link';
import { Smartphone, QrCode, Star, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const DownloadAppCTA: React.FC = () => {
  return (
    <section className="py-12 sm:py-20 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#031B2A] via-[#064E3B] to-[#0F766E] rounded-[24px] sm:rounded-[36px] p-5 xs:p-6 sm:p-14 text-white shadow-card-hover relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFBF1]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center relative z-10">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black text-[#CCFBF1] uppercase tracking-wider backdrop-blur-md max-w-full truncate">
                <Smartphone className="w-3.5 h-3.5 text-[#2DD4BF] shrink-0" />
                <span className="truncate">MOBILE APP EXCLUSIVE</span>
              </div>

              <h2 className="text-2xl sm:text-5xl font-black tracking-tight leading-[1.08]">
                Take REHVO <br />
                wherever you go.
              </h2>

              <p className="text-xs sm:text-base text-[#CCFBF1]/80 max-w-xl font-medium leading-relaxed">
                Full-screen direct chat, scheduled physical walkthroughs, digital lease agreements, and society gate passes are best experienced on the native mobile app.
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

            {/* Right Column: Dual Device Mockup Preview */}
            <div className="lg:col-span-5 flex justify-center items-end gap-2 xs:gap-3 sm:gap-4 relative pt-4 sm:pt-6 overflow-hidden max-w-full">
              {/* iPhone Mockup */}
              <div className="w-[130px] xs:w-[160px] sm:w-[210px] h-[260px] xs:h-[320px] sm:h-[420px] bg-[#031B2A] rounded-[28px] sm:rounded-[36px] p-1.5 sm:p-2 border-2 border-slate-700 shadow-2xl overflow-hidden relative rotate-[-4deg]">
                <div className="w-full h-full bg-[#F8FAFC] rounded-[22px] sm:rounded-[28px] p-2.5 sm:p-3 text-[#031B2A] flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="text-[9px] sm:text-[10px] font-black text-[#0F766E]">REHVO iOS</div>
                    <div className="text-[11px] sm:text-xs font-black leading-tight">Verified Listings Guaranteed</div>
                    <div className="h-16 xs:h-20 sm:h-24 bg-teal-800 rounded-xl overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80"
                        alt="Mobile App"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-center text-[#64748B] py-1 bg-white rounded-lg border border-[#E2E8F0]">
                    Direct Landlord Chat
                  </div>
                </div>
              </div>

              {/* Android Mockup */}
              <div className="w-[120px] xs:w-[150px] sm:w-[195px] h-[240px] xs:h-[300px] sm:h-[390px] bg-slate-900 rounded-[26px] sm:rounded-[32px] p-1.5 sm:p-2 border-2 border-slate-700 shadow-2xl overflow-hidden relative rotate-[4deg] -mb-2">
                <div className="w-full h-full bg-white rounded-[20px] sm:rounded-[24px] p-2.5 sm:p-3 text-[#031B2A] flex flex-col justify-between overflow-hidden">
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="text-[9px] sm:text-[10px] font-black text-[#0F766E]">REHVO Android</div>
                    <div className="text-[11px] sm:text-xs font-black leading-tight">Digital Lease Vault</div>
                    <div className="bg-[#CCFBF1] p-1.5 sm:p-2 rounded-xl text-[8px] sm:text-[9px] font-bold text-[#064E3B] space-y-1">
                      <div>✓ Society Gate Pass</div>
                      <div>✓ Rent Rewards</div>
                    </div>
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-bold text-center text-white py-1 bg-[#0F766E] rounded-lg">
                    Book Visit
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
