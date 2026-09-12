'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Home, Users, Building2, BedDouble, ArrowRight } from 'lucide-react';
import { SavedCategory } from './SavedTabs';

interface SavedEmptyStateProps {
  category: SavedCategory;
}

export const SavedEmptyState: React.FC<SavedEmptyStateProps> = ({ category }) => {
  const meta = {
    all: {
      title: 'Your Saved Collection is empty',
      desc: 'Tap the heart icon (♡) on any flat, room, or flatmate profile to save it here for quick access.',
      primaryBtn: { label: 'Explore Mumbai Rentals', href: '/rent', icon: Home },
      secondaryBtn: { label: 'Find Flatmates', href: '/flatmates', icon: Users },
    },
    homes: {
      title: 'No saved homes yet',
      desc: 'Discover verified 1, 2, 3 BHK flats and houses across Mumbai with verified listing.',
      primaryBtn: { label: 'Browse Flats in Mumbai', href: '/rent', icon: Home },
      secondaryBtn: { label: 'Explore Top Localities', href: '/localities', icon: Building2 },
    },
    flatmates: {
      title: 'No saved flatmates yet',
      desc: 'Find compatible verified roommates by budget, location, and lifestyle in Mumbai.',
      primaryBtn: { label: 'Discover Flatmates', href: '/flatmates', icon: Users },
      secondaryBtn: { label: 'Create Flatmate Profile', href: '/flatmates/create', icon: ArrowRight },
    },
    commercial: {
      title: 'No saved commercial spaces',
      desc: 'Explore boutique offices, shops, and coworking spaces for rent in Mumbai.',
      primaryBtn: { label: 'Browse Commercial Spaces', href: '/commercial', icon: Building2 },
      secondaryBtn: { label: 'Explore Mumbai Rentals', href: '/rent', icon: Home },
    },
    pg: {
      title: 'No saved PG & Private Rooms',
      desc: 'Find budget-friendly single & shared rooms with verified marketplace.',
      primaryBtn: { label: 'Browse PG & Rooms', href: '/pg-rooms', icon: BedDouble },
      secondaryBtn: { label: 'Discover Flatmates', href: '/flatmates', icon: Users },
    },
  }[category];

  const PrimaryIcon = meta.primaryBtn.icon;
  const SecondaryIcon = meta.secondaryBtn.icon;

  return (
    <div className="rehvo-glass-card rounded-[32px] p-8 sm:p-14 text-center max-w-xl mx-auto my-8 border border-white/80 shadow-sm space-y-5">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-2xs border border-rose-200/60">
        <Heart className="w-7 h-7 fill-rose-500/20" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight">
          {meta.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] font-semibold max-w-md mx-auto leading-relaxed">
          {meta.desc}
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={meta.primaryBtn.href}
          className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
        >
          <PrimaryIcon className="w-4 h-4" />
          <span>{meta.primaryBtn.label}</span>
        </Link>

        <Link
          href={meta.secondaryBtn.href}
          className="w-full sm:w-auto h-11 px-6 rounded-full rehvo-glass-subtle text-xs font-bold text-[#031B2A] hover:bg-white/80 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <SecondaryIcon className="w-4 h-4" />
          <span>{meta.secondaryBtn.label}</span>
        </Link>
      </div>
    </div>
  );
};