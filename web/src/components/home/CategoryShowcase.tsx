import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const categories = [
    {
      id: 'flats',
      name: 'Flats & Apartments',
      descriptor: '1, 2, 3 BHK homes for families & working professionals',
      href: '/mumbai',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000&auto=format&fit=crop&q=80',
      tag: 'Full Homes',
    },
    {
      id: 'rooms',
      name: 'Private Single Rooms',
      descriptor: 'Furnished private rooms in premium shared apartments',
      href: '/rooms/mumbai',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
      tag: 'Private Room',
    },
    {
      id: 'pg',
      name: 'PG & Co-Living',
      descriptor: 'Managed residences with Wi-Fi, laundry, and meals included',
      href: '/pg/mumbai',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80',
      tag: 'All-Inclusive',
    },
    {
      id: 'studios',
      name: 'Studio Apartments',
      descriptor: 'Self-contained 1 RK & compact studios in transit corridors',
      href: '/studios/mumbai',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
      tag: '1 RK / Studio',
    },
    {
      id: 'flatmates',
      name: 'Flatmate Discovery',
      descriptor: 'Connect with roommates with aligned habits and room budgets',
      href: '/flatmates/mumbai',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80',
      tag: 'Social Match',
    },
  ];

  return (
    <section className="bg-white py-20 sm:py-28 border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                Categories
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              Spaces crafted for every lifestyle
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
              Select the exact rental format that matches your routine, work setup, and budget.
            </p>
          </div>

          <Link
            href="/mumbai"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
          >
            <span>Explore all formats</span>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5 Category Image Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={`group relative rounded-3xl overflow-hidden min-h-[260px] sm:min-h-[300px] flex flex-col justify-end p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:border-purple-300 transition-all duration-300 border border-stone-200/90 ${
                idx === 0 ? 'lg:col-span-2' : 'lg:col-span-1'
              }`}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-1.5 text-white">
                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full inline-block">
                  {cat.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight group-hover:text-purple-300 transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-2 max-w-sm">
                  {cat.descriptor}
                </p>

                <div className="pt-2 flex items-center gap-1 text-xs font-extrabold text-purple-300 group-hover:translate-x-1 transition-transform">
                  <span>Browse Collection</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
