import React from 'react';
import { ShieldCheck, MessageSquare, CalendarCheck, Zap } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-white py-8 border-b border-stone-200/90 shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
          <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-4 first:pl-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-extrabold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Verified Listings</h4>
              <p className="text-[11px] text-stone-500 font-medium">100% genuine homeowners</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-extrabold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Direct Conversations</h4>
              <p className="text-[11px] text-stone-500 font-medium">Live in-app chat with hosts</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 font-extrabold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Easy Scheduling</h4>
              <p className="text-[11px] text-stone-500 font-medium">Pick walkthrough time slots</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3 lg:pt-0 pl-0 lg:pl-6">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900">Secure & Trusted</h4>
              <p className="text-[11px] text-stone-500 font-medium">Zero broker commissions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
