'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserPlus, Users, CheckCircle2, HeartHandshake } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const CreateFlatmateCtaSection: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#FFFFFF] border-b border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F8FAFC] rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 border border-[#E2E8F0] shadow-sm">
          {/* Left Column: Text Content & CTAs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5F0] text-[#3C8D68] text-[11px] font-bold uppercase tracking-wider mb-3">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>FLATMATE COMMUNITY</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight">
                Looking for the right flatmate?
              </h2>

              <p className="text-sm sm:text-base font-medium text-[#64748B] mt-3 leading-relaxed max-w-xl">
                Create your profile and discover compatible people with matching routines, budgets, and habits in Mumbai. 100% free with verified marketplace.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#3C8D68] flex-shrink-0" />
                  <span>Verified Profiles & Work Info</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#3C8D68] flex-shrink-0" />
                  <span>Budget & Locality Matching</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#3C8D68] flex-shrink-0" />
                  <span>Direct In-App Messaging</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#031B2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#3C8D68] flex-shrink-0" />
                  <span>Verified Listing Guarantee</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <Link
                href="/flatmates/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3C8D68] hover:bg-[#327656] text-white text-xs font-bold px-7 py-3 rounded-full shadow-md hover:shadow-lg transition active:scale-98 group"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Flatmate Profile</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/flatmates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFFFFF] hover:bg-[#F1F5F9] text-[#031B2A] text-xs font-bold px-6 py-3 rounded-full border border-[#E2E8F0] transition"
              >
                <Users className="w-4 h-4 text-[#3C8D68]" />
                <span>Browse Flatmates</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Social Human Lifestyle Photography (5 Cols) */}
          <div className="lg:col-span-5 relative h-[280px] sm:h-[380px] rounded-2xl sm:rounded-[28px] overflow-hidden bg-[#031B2A] shadow-inner">
            <RehvoImage
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80"
              alt="Compatible flatmates sharing a living space"
              fill
              fallbackCategory="flatmate"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/85 via-transparent to-transparent z-10 pointer-events-none" />

            <div className="absolute bottom-5 left-5 right-5 text-white z-20 space-y-1.5">
              <span className="bg-[#3C8D68] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full inline-block shadow-xs">
                LIFESTYLE MATCHING
              </span>
              <p className="text-sm font-extrabold text-white leading-snug">
                Find people you’ll actually enjoy living with in Mumbai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
