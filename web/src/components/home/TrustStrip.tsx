import React from 'react';
import { CheckCircle2, ShieldCheck, MessageCircle, CalendarCheck } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-white py-6 sm:py-7 border-y border-stone-200/80 shadow-xs relative z-20">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
          {/* 1. Verified Listing */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 pl-0 lg:pl-3 first:pl-0">
            <div className="w-10 h-10 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center flex-shrink-0 font-extrabold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Verified Listing</h4>
              <p className="text-[11px] text-stone-500 font-medium">Verified connections</p>
            </div>
          </div>

          {/* 2. Verified Listings */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 pl-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Verified Listings</h4>
              <p className="text-[11px] text-stone-500 font-medium">Inspected photos & specs</p>
            </div>
          </div>

          {/* 3. Direct In-App Chat */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 pl-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 font-extrabold">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Direct In-App Chat</h4>
              <p className="text-[11px] text-stone-500 font-medium">Message owners privately</p>
            </div>
          </div>

          {/* 4. Scheduled Visits */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 pl-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 font-extrabold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Scheduled Visits</h4>
              <p className="text-[11px] text-stone-500 font-medium">Book inspection slots online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
