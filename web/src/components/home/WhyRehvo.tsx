'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, MessageCircle, CalendarCheck, Sparkles } from 'lucide-react';

export const WhyRehvo: React.FC = () => {
  const benefits = [
    {
      id: 'verified-listings',
      icon: ShieldCheck,
      title: 'Verified Listings',
      desc: '100% physically inspected spaces with authentic photos and confirmed landlord ownership.',
    },
    {
      id: 'verified-marketplace',
      icon: CheckCircle2,
      title: 'Verified Listing',
      desc: 'Connect directly with property owners and flatmates. Transparent pricing with no hidden charges.',
    },
    {
      id: 'direct-chat',
      icon: MessageCircle,
      title: 'Direct Chat',
      desc: 'Message verified landlords and prospective roommates in real time without exposing phone numbers.',
    },
    {
      id: 'easy-visits',
      icon: CalendarCheck,
      title: 'Easy Visits',
      desc: 'Pick your preferred date & time slots online and manage physical property inspections with one click.',
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#FFFFFF] border-b border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-3 py-1 rounded-full inline-block mb-2">
            TRUST & ASSURANCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#031B2A] tracking-tight">
            Why REHVO?
          </h2>
          <p className="text-sm sm:text-base font-medium text-[#64748B] mt-1.5">
            A transparent, zero-middleman marketplace built from the ground up for Mumbai.
          </p>
        </div>

        {/* 4 Trust Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {benefits.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-[#F8FAFC] rounded-[22px] p-6 border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F766E] flex items-center justify-center mb-4 shadow-2xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#031B2A] mb-1.5">
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
