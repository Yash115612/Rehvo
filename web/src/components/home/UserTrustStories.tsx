'use client';

import React from 'react';
import { ShieldCheck, HeartHandshake, KeyRound, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const UserTrustStories: React.FC = () => {
  const highlights = [
    {
      title: 'Direct Landlord Connections',
      desc: 'Talk directly with flat owners and flatmates without brokers pushing artificial prices or deposit demands.',
      stat: '100% Direct',
    },
    {
      title: 'Guaranteed Zero Middleman Fees',
      desc: 'Tenants save an average of ₹35,000 to ₹1,00,000 in upfront broker commissions on every rental agreement.',
      stat: '₹0 Commission',
    },
    {
      title: 'Confirmed Visit Scheduling',
      desc: 'Book physical walkthrough appointments directly with property owners and get confirmed access slots.',
      stat: 'Verified Visits',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#031B2A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#CCFBF1]0/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mb-10">
            <span className="inline-block bg-[#0F766E]/20 text-[#0F766E] border border-[#0F766E]/40 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              THE VERIFIED MARKETPLACE PROMISE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Built for transparent, honest rentals in Mumbai.
            </h2>
            <p className="text-stone-300 text-sm sm:text-base font-medium mt-2 leading-relaxed">
              Every listing on REHVO connects renters, entrepreneurs, and roommates directly with property owners. No middlemen, no spam calls, and no commission fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[#0F766E] font-black text-lg tracking-tight block mb-2">
                    {item.stat}
                  </span>
                  <h3 className="text-base font-bold text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-stone-300 text-xs font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
