'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Compass } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const PopularLocations: React.FC = () => {
  const heroLocality = {
    name: 'Andheri West',
    city: 'Mumbai',
    slug: 'andheri-west',
    badge: 'FEATURED NEIGHBOURHOOD',
    description:
      'Dual metro connectivity, Lokhandwala shopping, vibrant cafe culture, and Mumbai’s largest media hub.',
    image:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1400&auto=format&fit=crop&q=85',
    href: '/mumbai/andheri-west/flats-for-rent',
  };

  const secondaryLocalities = [
    {
      name: 'Bandra West',
      sub: 'Sea Link & Cafes',
      slug: 'bandra-west',
      image:
        'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=700&auto=format&fit=crop&q=80',
      href: '/mumbai/bandra-west/flats-for-rent',
    },
    {
      name: 'Powai',
      sub: 'Hiranandani & Tech',
      slug: 'powai',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&auto=format&fit=crop&q=80',
      href: '/mumbai/powai/flats-for-rent',
    },
    {
      name: 'Lower Parel',
      sub: 'Corporate Towers',
      slug: 'lower-parel',
      image:
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=700&auto=format&fit=crop&q=80',
      href: '/mumbai/lower-parel/flats-for-rent',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-2.5 py-0.5 rounded-md border border-[#99F6E4]/60 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#0F766E]" />
                DESTINATIONS
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Popular Locations
            </h2>
            <p className="text-sm font-medium text-stone-500 mt-1">
              Explore the neighbourhoods people love across Mumbai.
            </p>
          </div>

          <Link
            href="/localities"
            className="text-xs sm:text-sm font-bold text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 transition group"
          >
            <span>View all locations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Layout: 1 Large Full-Width Hero Location Card */}
        <div className="space-y-6">
          <Link
            href={heroLocality.href}
            className="group relative block w-full h-[320px] sm:h-[380px] rounded-[32px] overflow-hidden bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 border border-stone-200/80"
          >
            <RehvoImage
              src={heroLocality.image}
              alt={heroLocality.name}
              fill
              fallbackCategory="locality"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-90"
              sizes="100vw"
              priority
            />
            {/* Cinematic Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 z-10 pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-6 left-6 z-20">
              <span className="bg-stone-900/85 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm">
                {heroLocality.badge}
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F766E] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{heroLocality.city}, India</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
                  {heroLocality.name}
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                  {heroLocality.description}
                </p>
              </div>

              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 bg-white text-stone-950 px-6 py-3 rounded-full text-xs font-extrabold shadow-lg group-hover:bg-[#0F766E] group-hover:text-white transition-all duration-300">
                  <span>Explore {heroLocality.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Bottom Row of 3 Smaller Destination Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryLocalities.map((loc) => (
              <Link
                key={loc.slug}
                href={loc.href}
                className="group relative h-[200px] sm:h-[220px] rounded-[24px] overflow-hidden bg-stone-900 shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-200/80 flex flex-col justify-end p-5"
              >
                <RehvoImage
                  src={loc.image}
                  alt={loc.name}
                  fill
                  fallbackCategory="locality"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-75 group-hover:opacity-85"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10 pointer-events-none" />

                <div className="relative z-20 flex items-end justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-stone-300 block mb-0.5">
                      {loc.sub}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-white group-hover:text-[#0F766E] transition">
                      {loc.name}
                    </h4>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#0F766E] transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
