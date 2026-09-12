import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight } from 'lucide-react';

export const PopularLocalities: React.FC = () => {
  const localities = [
    {
      slug: 'andheri-west',
      name: 'Andheri West',
      count: '2,332+ Properties',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    },
    {
      slug: 'bandra-west',
      name: 'Bandra West',
      count: '1,890+ Properties',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    },
    {
      slug: 'powai',
      name: 'Powai',
      count: '1,430+ Properties',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    },
    {
      slug: 'goregaon-west',
      name: 'Goregaon East',
      count: '1,160+ Properties',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=80',
    },
    {
      slug: 'thane-west',
      name: 'Thane West',
      count: '960+ Properties',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-24 border-b border-stone-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-[#0F766E] uppercase tracking-wider block">
              EXPLORE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Popular Localities
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Find homes in the neighbourhoods Mumbai loves.
            </p>
          </div>

          <Link
            href="/localities"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F766E] hover:text-[#064E3B] transition"
          >
            <span>View all localities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5 Locality Cards Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {localities.map((loc) => (
              <Link
                key={loc.slug}
                href={`/mumbai/${loc.slug}`}
                className="group bg-white rounded-2xl p-3 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#99F6E4] transition-all duration-300 flex flex-col"
              >
                {/* Locality Thumbnail */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-3">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="space-y-0.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-stone-900 group-hover:text-[#0F766E] transition leading-tight">
                    {loc.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    {loc.count}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Scroll Indicator Pill */}
          <Link
            href="/localities"
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-stone-200 hidden xl:flex items-center justify-center text-stone-600 hover:text-[#0F766E] hover:scale-105 transition"
            aria-label="View more localities"
          >
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
