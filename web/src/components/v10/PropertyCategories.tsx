'use client';

import React from 'react';
import Link from 'next/link';
import {
  Home,
  BedDouble,
  DoorClosed,
  Users,
  Building2,
  Castle,
  Layers,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'apartment',
    title: 'Rent Apartment',
    subtitle: '1, 2, 3+ BHK Flats',
    icon: Home,
    href: '/search?category=residential&type=flat',
    badge: 'Trending',
    iconBg: '#CCFBF1',
    iconColor: '#0F766E',
  },
  {
    id: 'pg',
    title: 'PG & Co-Living',
    subtitle: 'Furnished with Meals',
    icon: BedDouble,
    href: '/search?category=residential&type=pg',
    badge: 'Popular',
    iconBg: '#FEF9C3',
    iconColor: '#D97706',
  },
  {
    id: 'rooms',
    title: 'Private Rooms',
    subtitle: 'Single & Master Rooms',
    icon: DoorClosed,
    href: '/search?category=residential&type=room',
    badge: 'Zero Deposit',
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
  },
  {
    id: 'flatmates',
    title: 'Flatmates',
    subtitle: 'VibeMatch Seeker Profiles',
    icon: Users,
    href: '/flatmates',
    badge: 'AI Match',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    subtitle: 'Offices, Shops & Hubs',
    icon: Building2,
    href: '/search?category=commercial',
    badge: 'Verified Listings',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
  },
  {
    id: 'villas',
    title: 'Villas & Bungalows',
    subtitle: 'Independent Living',
    icon: Castle,
    href: '/search?category=residential&type=villa',
    badge: 'Luxury',
    iconBg: '#F3E8FF',
    iconColor: '#9333EA',
  },
  {
    id: 'studio',
    title: 'Studio Flats',
    subtitle: 'Compact 1 RK / Studios',
    icon: Layers,
    href: '/search?category=residential&type=studio',
    badge: 'Budget Pick',
    iconBg: '#FFE4E6',
    iconColor: '#E11D48',
  },
  {
    id: 'plots',
    title: 'Commercial Plots',
    subtitle: 'Open Yards & Warehousing',
    icon: MapPin,
    href: '/search?category=commercial&type=commercial_plot',
    badge: 'Industrial',
    iconBg: '#F1F5F9',
    iconColor: '#475569',
  },
];

export const PropertyCategories: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 border-y border-[#E2E8F0] bg-white">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <div className="text-[11px] font-black tracking-widest text-[#0F766E] uppercase">
              Explore by Space
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Property Categories
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1 group transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scrollable Categories Track */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group bg-[#F8FAFC] hover:bg-white p-3.5 sm:p-4 rounded-[28px] border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: cat.iconBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: cat.iconColor }} />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-xs font-extrabold text-[#031B2A] group-hover:text-[#0F766E] transition leading-tight">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] text-[#64748B] line-clamp-1 font-medium">
                    {cat.subtitle}
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
