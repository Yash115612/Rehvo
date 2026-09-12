'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const RentOwnerCta: React.FC = () => {
  return (
    <section className="rehvo-glass-card rounded-[32px] overflow-hidden border border-white/80 p-6 sm:p-10 shadow-lg relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full rehvo-glass-subtle text-[#031B2A] text-[11px] font-bold uppercase tracking-wider shadow-2xs">
            <KeyRound className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>FOR PROPERTY OWNERS & LANDLORDS</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight leading-tight">
            Have a residential flat or house to rent?
          </h3>

          <p className="text-xs sm:text-sm text-[#64748B] font-medium max-w-lg leading-relaxed">
            List your home on REHVO to connect with verified tenants directly. Transparent pricing, scheduled visits, and full landlord control over your pricing and terms.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] shadow-2xs border border-white/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Verified Listing Charged</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] shadow-2xs border border-white/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Verified Working Tenants</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] shadow-2xs border border-white/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Direct In-App Chat</span>
            </div>
          </div>

          <div className="pt-3">
            <Link
              href="/owner/properties/new"
              className="inline-flex items-center gap-2 rehvo-glass-coral text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-2xl shadow-md transition active:scale-98 cursor-pointer"
            >
              <span>List Your Property Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Photo Frame */}
        <div className="lg:col-span-5 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#F1F5F9] border border-white/80 shadow-md">
          <RehvoImage
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop&q=80"
            alt="Modern living room interior"
            fill
            fallbackCategory="property"
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </div>
    </section>
  );
};
