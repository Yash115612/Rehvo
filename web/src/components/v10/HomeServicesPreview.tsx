'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Wrench,
  Truck,
  Paintbrush,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

const SERVICES = [
  {
    icon: Sparkles,
    title: 'Deep Cleaning',
    subtitle: 'Kitchen, bathroom & full home sanitization',
    price: 'Starting ₹1,499',
    bg: '#CCFBF1',
    color: '#0F766E',
  },
  {
    icon: Zap,
    title: 'Electrician',
    subtitle: 'Wiring, fixtures, AC repair & switchboards',
    price: 'Starting ₹299',
    bg: '#FEF3C7',
    color: '#D97706',
  },
  {
    icon: Wrench,
    title: 'Plumber',
    subtitle: 'Tap leakage, pipe fittings & drain clearing',
    price: 'Starting ₹299',
    bg: '#E0F2FE',
    color: '#0284C7',
  },
  {
    icon: Truck,
    title: 'Packers & Movers',
    subtitle: 'Safe intra-city relocation with transit insurance',
    price: 'Free Quote',
    bg: '#DCFCE7',
    color: '#16A34A',
  },
  {
    icon: Paintbrush,
    title: 'Home Painting',
    subtitle: 'Interior repainting, waterproofing & texture',
    price: 'Starting ₹4,999',
    bg: '#F3E8FF',
    color: '#9333EA',
  },
  {
    icon: ShieldAlert,
    title: 'Pest Control',
    subtitle: 'Odorless herbal cockroach & termite treatment',
    price: 'Starting ₹899',
    bg: '#FFE4E6',
    color: '#E11D48',
  },
];

export const HomeServicesPreview: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-t border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-black tracking-widest text-[#0F766E] uppercase">
              VERIFIED SERVICE PARTNERS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Essential Home Services
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium max-w-xl">
              Professional, background-verified technicians with transparent pricing and instant booking.
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 group shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <Link
                key={idx}
                href="/services"
                className="group bg-white hover:bg-white rounded-[28px] p-6 border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex items-start gap-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: srv.bg }}
                >
                  <Icon className="w-6 h-6" style={{ color: srv.color }} />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#031B2A] group-hover:text-[#0F766E] transition">
                      {srv.title}
                    </h3>
                    <span className="text-[10px] font-extrabold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md">
                      {srv.price}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed font-medium">
                    {srv.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
