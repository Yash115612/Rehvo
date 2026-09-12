'use client';

import React from 'react';
import Link from 'next/link';
import {
  QrCode,
  CreditCard,
  Building,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const SOCIETY_ITEMS = [
  {
    icon: QrCode,
    title: 'Visitor Pass',
    desc: 'Instant QR guest passes & pre-approved entry for cabs, couriers, and visitors.',
    tag: 'Instant QR',
    color: '#0F766E',
    bg: '#CCFBF1',
  },
  {
    icon: CreditCard,
    title: 'Maintenance',
    desc: 'Pay society dues with credit card or UPI with auto-generated receipt ledgers.',
    tag: '0% Surcharge',
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    icon: Building,
    title: 'Amenities Booking',
    desc: 'Reserve clubhouses, swimming pools, tennis courts, and party halls instantly.',
    tag: 'Live Slots',
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    icon: ShieldCheck,
    title: 'Smart Security',
    desc: 'Guard desk intercom, verified resident directory, and instant emergency alerts.',
    tag: '24/7 Verified',
    color: '#16A34A',
    bg: '#DCFCE7',
  },
];

export const SocietyServicesPreview: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-black tracking-widest text-[#0F766E] uppercase">
              SMART GATED LIVING
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Society Services Preview
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium max-w-xl">
              From automated gate passes to instant maintenance payments — modern residential society living managed effortlessly.
            </p>
          </div>

          <Link
            href="/society-services"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 group shrink-0"
          >
            <span>Explore Society Ecosystem</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SOCIETY_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8FAFC] hover:bg-white rounded-[28px] p-6 border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: item.bg }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span className="text-[10px] font-extrabold bg-white px-2.5 py-1 rounded-full border border-[#E2E8F0] text-[#031B2A]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#031B2A] mb-1.5">{item.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#E2E8F0]">
                  <Link
                    href="/society-services"
                    className="text-xs font-bold text-[#0F766E] flex items-center gap-1 group"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
