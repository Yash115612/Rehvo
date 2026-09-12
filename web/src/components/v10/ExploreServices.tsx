'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  FileCheck,
  Lock,
  ShieldCheck,
  CalendarCheck,
  Truck,
  Sparkles,
  FolderLock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  tagColor: string;
  tagBg: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  route: string;
  popular?: boolean;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'rent_pay',
    title: 'Pay Rent Online',
    subtitle: 'Instant UPI, 45-day credit & 1% R-Cash back',
    tag: 'NEW • 1% CASHBACK',
    tagColor: '#059669',
    tagBg: '#D1FAE5',
    icon: CreditCard,
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    route: '/download',
    popular: true,
  },
  {
    id: 'agreement',
    title: 'Digital e-Lease',
    subtitle: 'Govt stamp duty & doorstep Aadhaar e-sign',
    tag: 'GOVT VERIFIED',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    icon: FileCheck,
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/services',
    popular: true,
  },
  {
    id: 'movers',
    title: 'Packers & Movers',
    subtitle: 'Dedicated relocation teams with transit insurance',
    tag: 'TRANSIT COVER',
    tagColor: '#16A34A',
    tagBg: '#DCFCE7',
    icon: Truck,
    iconColor: '#16A34A',
    iconBg: '#F0FDF4',
    route: '/services',
    popular: true,
  },
  {
    id: 'zero_deposit',
    title: 'Zero Deposit Pass',
    subtitle: 'Move in without heavy lock-in deposits',
    tag: 'NO LOCK-IN',
    tagColor: '#4338CA',
    tagBg: '#E0E7FF',
    icon: Lock,
    iconColor: '#4F46E5',
    iconBg: '#EEF2FF',
    route: '/search?deposit=zero',
  },
  {
    id: 'cleaning',
    title: 'Deep Cleaning',
    subtitle: 'Mechanized home, kitchen & sofa sanitization',
    tag: 'DEPOSIT SAFE',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    icon: Sparkles,
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/services',
  },
  {
    id: 'verification',
    title: 'Tenant Verification',
    subtitle: 'DigiLocker KYC & police background check',
    tag: '100% SAFE',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    icon: ShieldCheck,
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/services',
  },
  {
    id: 'move_in',
    title: 'Move-In Concierge',
    subtitle: 'Checklist, broadband transfer & key delivery',
    tag: 'ALL-IN-ONE',
    tagColor: '#0F766E',
    tagBg: '#CCFBF1',
    icon: CalendarCheck,
    iconColor: '#0F766E',
    iconBg: '#F0FDFA',
    route: '/services',
  },
  {
    id: 'vault',
    title: 'Document Vault',
    subtitle: '256-bit encrypted leases, NOCs & HRA receipts',
    tag: '256-BIT',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    icon: FolderLock,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    route: '/download',
  },
];

export const ExploreServices: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black uppercase tracking-wider">
                ECOSYSTEM
              </span>
              <span className="text-[11px] font-bold text-[#64748B]">TENANT &amp; OWNER ESSENTIALS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight">
              Explore Services
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
              Curated tools &amp; conveniences for seamless renting, moving, and staying in Mumbai
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Previous services"
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0] flex items-center justify-center text-[#031B2A] shadow-2xs transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Next services"
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-50 border border-[#E2E8F0] flex items-center justify-center text-[#031B2A] shadow-2xs transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-1.5 ml-2 text-xs font-bold text-[#0F766E] hover:text-[#064E3B] transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Zoomcar-Inspired Card Track / Grid */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.id}
                href={srv.route}
                className="group w-[260px] sm:w-[290px] shrink-0 snap-start bg-white rounded-[26px] sm:rounded-[28px] p-5 sm:p-6 border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon Container + Badge Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: srv.iconBg }}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" style={{ color: srv.iconColor }} />
                    </div>

                    {srv.tag && (
                      <span
                        className="text-[9.5px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: srv.tagBg, color: srv.tagColor }}
                      >
                        {srv.tag}
                      </span>
                    )}
                  </div>

                  {/* Body Text */}
                  <h3 className="text-base sm:text-lg font-black text-[#031B2A] group-hover:text-[#0F766E] transition mb-1 leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium leading-relaxed line-clamp-2">
                    {srv.subtitle}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-bold text-[#0F766E]">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};
