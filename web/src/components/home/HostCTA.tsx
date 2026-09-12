'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, PlusCircle, Building, CheckCircle2, ShieldCheck } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const HostCTA: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FFFFFF] rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 border border-[#E2E8F0] shadow-sm">
          {/* Left Visual Architectural Interior (5 Cols) */}
          <div className="lg:col-span-5 relative h-[280px] sm:h-[360px] rounded-2xl sm:rounded-[28px] overflow-hidden bg-[#031B2A] shadow-inner">
            <RehvoImage
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80"
              alt="Architectural luxury interior"
              fill
              fallbackCategory="property"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/85 via-transparent to-transparent z-10 pointer-events-none" />

            <div className="absolute bottom-5 left-5 right-5 text-white z-20 space-y-1">
              <span className="bg-[#031B2A]/90 backdrop-blur-xs text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>DIRECT LANDLORD PLATFORM</span>
              </span>
              <p className="text-sm font-extrabold text-white">
                Transparent pricing for owners & direct tenant communication.
              </p>
            </div>
          </div>

          {/* Right Information & Conversion (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-1 rounded-md inline-block mb-3">
                FOR PROPERTY OWNERS & HOSTS
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight">
                Have a property to rent?
              </h2>

              <p className="text-sm sm:text-base font-medium text-[#64748B] mt-3 leading-relaxed max-w-xl">
                List your property on REHVO and reach genuine renters across Mumbai. Manage direct enquiries, schedule visits, and find verified tenants with zero middleman fees.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                  <span>Flats, Apartments, PGs & Stays</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                  <span>Offices, Shops & Showrooms</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                  <span>Direct In-App Landlord Chat</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                  <span>100% Free Listing Submission</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <Link
                href="/list-property"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-bold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition active:scale-98 group"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Property</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/list-property?category=commercial"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#031B2A] text-xs font-bold px-6 py-3.5 rounded-full border border-[#E2E8F0] transition"
              >
                <Building className="w-4 h-4 text-[#4263EB]" />
                <span>List Commercial Space</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
