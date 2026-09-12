'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface NeighbourhoodItem {
  id: string;
  name: string;
  count: string;
  slug: string;
  image: string;
}

const NEIGHBOURHOODS: NeighbourhoodItem[] = [
  {
    id: 'andheri-west',
    name: 'Andheri West',
    count: '1,248+ Properties',
    slug: '/rent?locality=Andheri+West',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'bandra-west',
    name: 'Bandra West',
    count: '901+ Properties',
    slug: '/rent?locality=Bandra+West',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'powai',
    name: 'Powai',
    count: '656+ Properties',
    slug: '/rent?locality=Powai',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'worli',
    name: 'Worli',
    count: '642+ Properties',
    slug: '/rent?locality=Worli',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'lower-parel',
    name: 'Lower Parel',
    count: '516+ Properties',
    slug: '/rent?locality=Lower+Parel',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'khar-west',
    name: 'Khar West',
    count: '512+ Properties',
    slug: '/rent?locality=Khar+West',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  },
];

export const ExploreNeighbourhoodsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#0F766E] block mb-1">
              EXPLORE MUMBAI
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#031B2A] tracking-tight">
              Explore top neighbourhoods
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
              Discover vibrant localities and find the right neighbourhood for you.
            </p>
          </div>

          <Link
            href="/localities"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#031B2A] hover:text-[#0F766E] transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <span>Explore all neighbourhoods</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Locality Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {NEIGHBOURHOODS.map((item) => (
            <Link
              key={item.id}
              href={item.slug}
              className="group rehvo-glass-card rounded-[22px] p-2.5 flex flex-col space-y-2 active:scale-98 transition-all duration-200"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full rounded-[16px] overflow-hidden bg-[#F1F5F9]">
                <RehvoImage
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>

              {/* Text Info */}
              <div className="px-1 pb-1">
                <h3 className="font-extrabold text-xs sm:text-sm text-[#031B2A] group-hover:text-[#0F766E] transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-[11px] font-medium text-[#64748B] mt-0.5">
                  {item.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
