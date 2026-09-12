'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Users, MapPin, UserPlus } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface FlatmateShowcaseProps {
  flatmates?: PublicFlatmate[];
}

export const FlatmateShowcase: React.FC<FlatmateShowcaseProps> = ({
  flatmates = [],
}) => {
  const featured = flatmates[0] || null;
  const supporting = flatmates.slice(1, 4);

  const fallbackProfiles = [
    {
      id: 'fm-1',
      name: 'Rohan Mehta',
      profession: 'Product Designer',
      locality: 'Bandra West',
      budget_max: 28000,
      gender: 'Male',
      photo:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'fm-2',
      name: 'Pooja Iyer',
      profession: 'Software Engineer',
      locality: 'Powai',
      budget_max: 20000,
      gender: 'Female',
      photo:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'fm-3',
      name: 'Siddharth Rao',
      profession: 'Fintech Analyst',
      locality: 'Lower Parel',
      budget_max: 32000,
      gender: 'Male',
      photo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <Users className="w-3 h-3 text-[#0F766E]" />
                COMMUNITY & ROOMMATES
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Find Your Flatmate
            </h2>
            <p className="text-sm font-medium text-stone-500 mt-1">
              Meet verified people looking for flatmates and shared flats across Mumbai.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/flatmates/create"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:border-stone-300 px-3.5 py-1.5 rounded-full shadow-sm hover:text-[#0F766E] transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Create Profile</span>
            </Link>
            <Link
              href="/flatmates"
              className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1 transition"
            >
              <span>Browse all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 1 Large Featured + 3 Stacked Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Large Featured Profile (Takes 6 cols) */}
          <Link
            href={featured ? `/flatmates/${featured.id}` : '/flatmates'}
            className="lg:col-span-6 group relative h-[360px] sm:h-[400px] rounded-3xl overflow-hidden bg-stone-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 sm:p-8"
          >
            <RehvoImage
              src={
                featured?.photo ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
              }
              alt={featured?.name || 'Flatmate profile in Mumbai'}
              fill
              fallbackCategory="flatmate"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 z-10 pointer-events-none" />

            <div className="relative z-20 flex items-center justify-between">
              <span className="bg-emerald-500/90 text-white text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full shadow-sm">
                VERIFIED ROOMMATE
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                {featured?.gender || 'Any Gender'}
              </span>
            </div>

            <div className="relative z-20">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{featured?.budget_max?.toLocaleString('en-IN') || '22,000'}
                </span>
                <span className="text-xs text-stone-300 font-semibold">/month budget</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {featured?.name || 'Aditi Sharma'}
              </h3>

              <div className="flex items-center gap-3 text-xs font-semibold text-stone-200">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{featured?.locality || 'Andheri West'}, Mumbai</span>
                </div>
                <span>•</span>
                <span>{featured?.profession || 'UI/UX Designer'}</span>
              </div>
            </div>
          </Link>

          {/* 3 Smaller Stacked Profile Cards (Takes 6 cols) */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-4">
            {(supporting.length > 0 ? supporting : fallbackProfiles).map((fm, idx) => {
              const fmName = 'name' in fm ? fm.name : 'Flatmate';
              const fmLoc = 'locality' in fm ? fm.locality : 'Mumbai';
              const fmBudget = 'budget_max' in fm ? fm.budget_max : 25000;
              const fmProf = 'profession' in fm ? fm.profession : 'Professional';
              const fmImg =
                'photo' in fm && fm.photo
                  ? fm.photo
                  : fallbackProfiles[idx % fallbackProfiles.length].photo;
              const fmHref = 'id' in fm && !fm.id.startsWith('fm-') ? `/flatmates/${fm.id}` : '/flatmates';

              return (
                <Link
                  key={idx}
                  href={fmHref}
                  className="group bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <RehvoImage
                      src={fmImg}
                      alt={fmName}
                      fill
                      fallbackCategory="flatmate"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base font-black text-stone-900">
                        ₹{fmBudget?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-500 font-semibold">/mo max</span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#0F766E] transition truncate mb-0.5">
                      {fmName}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="truncate">{fmLoc}</span>
                      <span>•</span>
                      <span className="truncate">{fmProf}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="text-xs font-bold text-[#0F766E] bg-[#CCFBF1] group-hover:bg-[#0F766E] group-hover:text-white px-3 py-1.5 rounded-full transition">
                      Connect
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
