'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Building2, BedDouble, Users, Compass, Plus, ArrowRight } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface ExploreCardItem {
  id: string;
  title: string;
  subtitle: string;
  linkText: string;
  href: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  image: string;
}

const EXPLORE_ITEMS: ExploreCardItem[] = [
  {
    id: 'rent-homes',
    title: 'Rent Homes',
    subtitle: 'Flats, apartments & more',
    linkText: 'Explore →',
    href: '/rent',
    icon: Home,
    iconBg: 'bg-[#CCFBF1]',
    iconColor: '#0F766E',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'commercial',
    title: 'Commercial',
    subtitle: 'Offices, shops, showrooms & more',
    linkText: 'Explore →',
    href: '/commercial',
    icon: Building2,
    iconBg: 'bg-[#EEF2FF]',
    iconColor: '#4263EB',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'pg-rooms',
    title: 'PG & Rooms',
    subtitle: 'Co-living, PGs & single rooms',
    linkText: 'Explore →',
    href: '/pg-rooms',
    icon: BedDouble,
    iconBg: 'bg-[#FEF9C3]',
    iconColor: '#D69E2E',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'flatmates',
    title: 'Flatmates',
    subtitle: 'Find verified flatmates & shared flats',
    linkText: 'Explore →',
    href: '/flatmates',
    icon: Users,
    iconBg: 'bg-[#EBF5F0]',
    iconColor: '#3C8D68',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'localities',
    title: 'Localities',
    subtitle: 'Explore neighbourhoods across Mumbai',
    linkText: 'Explore →',
    href: '/localities',
    icon: Compass,
    iconBg: 'bg-[#EDF6F8]',
    iconColor: '#4C7A86',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'list-property',
    title: 'List Property',
    subtitle: 'List your property for free',
    linkText: 'Start now →',
    href: '/owner/properties/new',
    icon: Plus,
    iconBg: 'bg-[#CCFBF1]',
    iconColor: '#0F766E',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
  },
];

export const ExploreByWhatMatters: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#0F766E] block mb-1">
            EXPLORE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#031B2A] tracking-tight">
            Explore by what matters
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
            Choose what you're looking for and we'll help you find the perfect match.
          </p>
        </div>

        {/* 6-Card Discovery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {EXPLORE_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                className="group rehvo-glass-card rounded-[24px] overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 active:scale-98"
              >
                {/* Top Content */}
                <div className="space-y-2 mb-3">
                  {/* Icon Circle */}
                  <div
                    className={`w-9 h-9 rounded-full ${item.iconBg} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-4 h-4" style={{ color: item.iconColor }} />
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-[#031B2A] group-hover:text-[#0F766E] transition-colors leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-2 leading-snug">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Explore Link */}
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#031B2A] group-hover:text-[#0F766E] transition-colors">
                    {item.linkText}
                  </span>
                </div>

                {/* Bottom Image Thumbnail */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F8FAFC]">
                  <RehvoImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
