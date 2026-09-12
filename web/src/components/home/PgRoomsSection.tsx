'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BedDouble, Utensils, Wifi } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const PgRoomsSection: React.FC = () => {
  const categories = [
    {
      id: 'pg-coliving',
      title: 'Managed PGs & Co-Living',
      sub: 'Meals, daily housekeeping, high-speed Wi-Fi and zero deposit options.',
      badge: 'POPULAR',
      rent: 'From ₹10,000 / mo',
      image:
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
      href: '/pg-rooms?type=pg',
    },
    {
      id: 'private-rooms',
      title: 'Private 1RK & Single Rooms',
      sub: 'Your own private room inside furnished flats with shared kitchen access.',
      badge: 'PRIVATE',
      rent: 'From ₹14,000 / mo',
      image:
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80',
      href: '/pg-rooms?type=room',
    },
    {
      id: 'shared-stays',
      title: 'Shared Rooms for Students & Pros',
      sub: 'Twin & triple sharing options near major universities and corporate parks.',
      badge: 'BUDGET',
      rent: 'From ₹7,500 / mo',
      image:
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
      href: '/pg-rooms?type=shared',
    },
    {
      id: 'studio-stays',
      title: 'Compact Studio Apartments',
      sub: 'Fully independent self-contained 1RK/Studio spaces for working professionals.',
      badge: 'INDEPENDENT',
      rent: 'From ₹18,000 / mo',
      image:
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      href: '/pg-rooms?type=studio',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <BedDouble className="w-3 h-3 text-[#0F766E]" />
                BUDGET STAYS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              PG & Rooms
            </h2>
            <p className="text-sm font-medium text-stone-500 mt-1">
              Comfortable stays for every budget with verified amenities, meals and verified marketplace.
            </p>
          </div>

          <Link
            href="/pg-rooms"
            className="text-xs font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1 transition"
          >
            <span>Explore PG & Rooms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/11] w-full bg-stone-100 overflow-hidden">
                <RehvoImage
                  src={cat.image}
                  alt={cat.title}
                  fill
                  fallbackCategory="room"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

                <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[9px] font-extrabold tracking-wider px-2.5 py-1 rounded-full border border-white/20 z-20">
                  {cat.badge}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white z-20">
                  <span className="text-xs font-black tracking-tight">{cat.rent}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900 group-hover:text-[#0F766E] transition mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                    {cat.sub}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-stone-100 text-xs font-bold text-stone-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Utensils className="w-3 h-3 text-stone-400" /> Meals
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Wifi className="w-3 h-3 text-stone-400" /> Wi-Fi
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#0F766E] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
