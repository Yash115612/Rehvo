'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Building,
  KeyRound,
  FileCheck2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const RentTrustSection: React.FC = () => {
  const TRUST_PILLARS = [
    {
      icon: ShieldCheck,
      title: 'Index-II Title Verification',
      description:
        'Every verified home has its ownership records and government registration matched against Index-II to eliminate subletting frauds.',
      tag: 'Ownership Audit',
    },
    {
      icon: KeyRound,
      title: 'Zero Brokerage & Direct Contact',
      description:
        'Connect directly with genuine property owners. Browse transparent rental figures with no hidden commissions or agent markups.',
      tag: 'Direct Landlords',
    },
    {
      icon: Building,
      title: '100% Physical Walkthroughs',
      description:
        'Our field inspectors physically visit each listing to photograph genuine room dimensions, natural light, and society amenities.',
      tag: 'On-Ground Verified',
    },
    {
      icon: FileCheck2,
      title: 'Digital Tenancy & Deposit Security',
      description:
        'Legally sound digital rental agreements with biometric Aadhaar e-sign, police intimation support, and transparent deposit terms.',
      tag: 'Legal Protection',
    },
  ];

  return (
    <section className="w-full bg-slate-50 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-[#001741] text-xs font-bold uppercase tracking-wider">
            <Lock size={12} />
            <span>Rental Transparency Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001741] tracking-tight">
            How REHVO protects renters &amp; homeowners
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            We are replacing opaque broker networks with verified title deeds, upfront deposit terms, and instant visit scheduling.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-[#001741]/30 hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001741] text-white flex items-center justify-center shadow-xs">
                    <Icon size={20} />
                  </div>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-[#F97316]">
                    {pillar.tag}
                  </span>
                  <h3 className="text-base font-bold text-[#001741]">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#001741] rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">
              Own a property in Mumbai?
            </h3>
            <p className="text-xs text-slate-300">
              List directly on REHVO and connect with verified tenants without paying broker fees.
            </p>
          </div>
          <Link
            href="/list-property"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition shadow-md shrink-0"
          >
            <span>List Your Property Free</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
