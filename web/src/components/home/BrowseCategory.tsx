import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building, Home, Users, Sparkles, Building2 } from 'lucide-react';

export const BrowseCategory: React.FC = () => {
  const categories = [
    {
      id: 'flats',
      name: 'Flats',
      descriptor: 'Find your perfect flat',
      href: '/mumbai',
      icon: Building,
      iconBg: 'bg-orange-500 text-white',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'rooms',
      name: 'Rooms',
      descriptor: 'Private & shared rooms',
      href: '/rooms/mumbai',
      icon: Home,
      iconBg: 'bg-amber-500 text-white',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'pg',
      name: 'PG',
      descriptor: 'Comfortable PGs',
      href: '/pg/mumbai',
      icon: Building2,
      iconBg: 'bg-pink-500 text-white',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'studios',
      name: 'Studios',
      descriptor: 'Compact & convenient',
      href: '/studios/mumbai',
      icon: Sparkles,
      iconBg: 'bg-blue-500 text-white',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'flatmates',
      name: 'Flatmates',
      descriptor: 'Find your match',
      href: '/flatmates/mumbai',
      icon: Users,
      iconBg: 'bg-purple-600 text-white',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="bg-[#FAF8F5] py-16 sm:py-24 border-b border-stone-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#FF5533] uppercase tracking-wider block">
              BROWSE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Whatever you&apos;re looking for, we&apos;ve got it.
            </p>
          </div>

          <Link
            href="/mumbai"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF5533] hover:text-[#EE4422] transition"
          >
            <span>Explore all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5 Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/80 bg-stone-900"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />

                {/* Circular Icon in Center/Top */}
                <div className={`w-10 h-10 rounded-full ${cat.iconBg} flex items-center justify-center mb-auto shadow-md relative z-10`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Details */}
                <div className="relative z-10 space-y-0.5 text-white">
                  <h3 className="text-base sm:text-lg font-extrabold text-white group-hover:text-orange-300 transition">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-300 font-medium">
                    {cat.descriptor}
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
