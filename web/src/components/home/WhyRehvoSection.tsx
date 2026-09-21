'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, MessageCircle, CalendarCheck, Users } from 'lucide-react';

interface TrustCardItem {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}

const TRUST_ITEMS: TrustCardItem[] = [
  {
    icon: ShieldCheck,
    iconBg: 'bg-[#CCFBF1]',
    iconColor: '#0F766E',
    title: 'Verified Listing',
    desc: 'No hidden fees. Verified owners & middlemen. Transparent pricing on every agreement.',
  },
  {
    icon: CheckCircle2,
    iconBg: 'bg-[#ECFDF5]',
    iconColor: '#16A34A',
    title: 'Verified Listings',
    desc: 'Every listing is verified for quality, ownership and authenticity.',
  },
  {
    icon: MessageCircle,
    iconBg: 'bg-[#EEF2FF]',
    iconColor: '#4263EB',
    title: 'Direct Connect',
    desc: 'Chat directly with owners or verified flatmates in real time.',
  },
  {
    icon: CalendarCheck,
    iconBg: 'bg-[#FEF9C3]',
    iconColor: '#D69E2E',
    title: 'Easy Visits',
    desc: 'Schedule physical visits that fit your time, not theirs.',
  },
  {
    icon: Users,
    iconBg: 'bg-[#EBF5F0]',
    iconColor: '#3C8D68',
    title: 'Trusted by Thousands',
    desc: 'Join thousands of renters who found their place on REHVO.',
  },
];

export const WhyRehvoSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#0F766E] block mb-1">
            WHY REHVO?
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#031B2A] tracking-tight">
            A better way to find your place
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1.5">
            We remove the unnecessary, so you can focus on what truly matters.
          </p>
        </div>

        {/* 5-Card Trust Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rehvo-glass-card rounded-[22px] p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:shadow-xs transition-all duration-200"
              >
                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center shadow-2xs`}
                >
                  <Icon className="w-5 h-5" style={{ color: item.iconColor }} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#031B2A] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-[#64748B] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
