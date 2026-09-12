'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  FileCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calculator,
} from 'lucide-react';

const LOCALITY_RATES: Record<string, { multiplier: number; yieldPct: string }> = {
  'Bandra West': { multiplier: 1.45, yieldPct: '6.2%' },
  'Andheri West': { multiplier: 1.0, yieldPct: '5.9%' },
  'Powai': { multiplier: 1.15, yieldPct: '6.4%' },
  'BKC & Kurla': { multiplier: 1.35, yieldPct: '6.5%' },
  'Worli & Lower Parel': { multiplier: 1.5, yieldPct: '6.0%' },
  'Thane West': { multiplier: 0.65, yieldPct: '5.6%' },
};

const BHK_BASE_RATES: Record<string, number> = {
  '1 BHK': 32000,
  '2 BHK': 58000,
  '3 BHK': 95000,
  '4+ BHK': 160000,
};

export const HostAndEarn: React.FC = () => {
  const [selectedBhk, setSelectedBhk] = useState('2 BHK');
  const [selectedLocality, setSelectedLocality] = useState('Bandra West');

  const baseRate = BHK_BASE_RATES[selectedBhk] || 58000;
  const locData = LOCALITY_RATES[selectedLocality] || { multiplier: 1.45, yieldPct: '6.2%' };
  const estimatedRent = Math.round(baseRate * locData.multiplier);
  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(estimatedRent);

  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Row (Exact match to Zoomcar Host and Earn) */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black uppercase tracking-wider">
                HOST &amp; EARN
              </span>
              <span className="text-[11px] font-bold text-[#64748B]">LANDLORD ECOSYSTEM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight">
              Host and Earn
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
              Turn your Mumbai property into passive monthly income with verified tenants and transparent pricing
            </p>
          </div>

          <Link
            href="/list-property"
            className="text-xs sm:text-sm font-black text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 group transition"
          >
            <span>Register now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3 Zoomcar-Style Cards (Exact translation of media_1789126375254.jpg) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Earn from your Property */}
          <Link
            href="/list-property"
            className="group bg-[#E0F7F6]/50 hover:bg-[#E0F7F6] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-[#99F6E4]/50 hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <span className="text-[10px] font-black text-[#0F766E] uppercase tracking-wider">
                STEP 01
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#031B2A] group-hover:text-[#0F766E] transition mt-1 leading-snug">
                Earn from your<br />Property
              </h3>
              <p className="text-xs text-[#475569] font-medium mt-1">
                Direct verified tenants &bull; 0% broker commission
              </p>
            </div>

            {/* Illustration Area with Rupee Symbol Tag */}
            <div className="flex items-end justify-between pt-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-white/80 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Building2 className="w-11 h-11 text-[#0F766E] stroke-[2.2]" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#10B981] text-white text-xs font-black flex items-center justify-center shadow-md">
                  ₹
                </div>
              </div>

              <span className="text-xs font-extrabold text-[#0F766E] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                List for Free <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 2: Hassle-free tenant lease */}
          <Link
            href="/society-services"
            className="group bg-[#ECFDF5]/60 hover:bg-[#ECFDF5] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-[#A7F3D0]/60 hover:border-[#10B981]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <span className="text-[10px] font-black text-[#10B981] uppercase tracking-wider">
                STEP 02
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#031B2A] group-hover:text-[#10B981] transition mt-1 leading-snug">
                Hassle-free<br />tenant lease
              </h3>
              <p className="text-xs text-[#475569] font-medium mt-1">
                Govt registered e-stamp duty &amp; biometric KYC
              </p>
            </div>

            <div className="flex items-end justify-between pt-6">
              <div className="w-20 h-20 rounded-2xl bg-white/80 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileCheck className="w-11 h-11 text-[#10B981] stroke-[2.2]" />
              </div>

              <span className="text-xs font-extrabold text-[#10B981] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Digital Agreements <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 3: Calculate future yield */}
          <Link
            href="/list-property"
            className="group bg-[#FFFBEB]/70 hover:bg-[#FFFBEB] rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-[#FDE68A]/60 hover:border-[#F59E0B]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <span className="text-[10px] font-black text-[#D97706] uppercase tracking-wider">
                STEP 03
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#031B2A] group-hover:text-[#D97706] transition mt-1 leading-snug">
                Calculate your<br />future yield
              </h3>
              <p className="text-xs text-[#475569] font-medium mt-1">
                Real-time locality rental market index &amp; ROI
              </p>
            </div>

            <div className="flex items-end justify-between pt-6">
              <div className="w-20 h-20 rounded-2xl bg-white/80 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-11 h-11 text-[#F59E0B] stroke-[2.2]" />
              </div>

              <span className="text-xs font-extrabold text-[#D97706] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Live Yield Tool <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

        </div>

        {/* Interactive Rental Income Estimator (Zoomcar / App Teaser Card) */}
        <div className="bg-gradient-to-br from-[#F0FDFA] via-white to-[#FAF5FF] rounded-[32px] p-6 sm:p-8 lg:p-10 border border-[#0F766E]/20 shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading & Selection Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>🏡 Own a Property in Mumbai?</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
                  Estimate Your Monthly Rental Income
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] font-medium mt-1 max-w-xl">
                  Select your apartment configuration and locality to preview estimated monthly cashflow and projected gross yield based on active verified transactions.
                </p>
              </div>

              {/* BHK Selector Buttons */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-[#64748B] tracking-wider">
                  Select Configuration
                </label>
                <div className="flex flex-wrap gap-2">
                  {['1 BHK', '2 BHK', '3 BHK', '4+ BHK'].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setSelectedBhk(bhk)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                        selectedBhk === bhk
                          ? 'bg-[#0F766E] text-white shadow-xs'
                          : 'bg-white text-[#031B2A] border border-[#E2E8F0] hover:border-[#0F766E]'
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locality Selector Chips */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-[#64748B] tracking-wider">
                  Select Rental Hub
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(LOCALITY_RATES).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedLocality(loc)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedLocality === loc
                          ? 'bg-[#CCFBF1] text-[#064E3B] font-black border border-[#0F766E]'
                          : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#031B2A]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live Calculated Metric Card */}
            <div className="lg:col-span-5 bg-white rounded-[26px] p-6 sm:p-7 border border-[#0F766E]/20 shadow-card-hover space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#0F766E]" />
                  <span className="text-xs font-black text-[#031B2A] uppercase tracking-wider">
                    Calculated Result
                  </span>
                </div>
                <span className="text-[10.5px] font-black bg-[#CCFBF1] text-[#064E3B] px-2.5 py-0.5 rounded-full">
                  LIVE ESTIMATE
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-[#64748B]">Estimated Monthly Rent</div>
                <div className="text-3xl sm:text-4xl font-black text-[#0F766E] tracking-tight mt-1">
                  {formattedRent}
                  <span className="text-xs text-[#64748B] font-medium ml-1">/ month</span>
                </div>
                <div className="text-[11.5px] font-medium text-[#64748B] mt-1">
                  For {selectedBhk} in {selectedLocality}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <div className="text-[10px] font-black uppercase text-[#64748B]">Projected Yield</div>
                  <div className="text-lg font-black text-[#031B2A] mt-0.5">{locData.yieldPct}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-[#64748B]">Broker Commission</div>
                  <div className="text-lg font-black text-[#059669] mt-0.5">₹0 (Zero)</div>
                </div>
              </div>

              <Link
                href="/list-property"
                className="w-full h-12 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md transition"
              >
                <span>Post Your Property Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
