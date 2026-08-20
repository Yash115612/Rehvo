import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const LocationShowcase: React.FC = () => {
  const topLocalities = [
    {
      slug: 'andheri-west',
      name: 'Andheri West',
      zone: 'Western Suburbs',
      rent: '₹35,000 - ₹85,000',
      description: 'Prime media & commercial powerhouse with direct Metro Lines 1, 2A & 7 connectivity.',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    },
    {
      slug: 'bandra-west',
      name: 'Bandra West',
      zone: 'Western Suburbs',
      rent: '₹55,000 - ₹1,40,000',
      description: 'The cultural capital of Mumbai with sea promenades, heritage lanes & cafes.',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'powai',
      name: 'Powai',
      zone: 'Central Suburbs',
      rent: '₹32,000 - ₹82,000',
      description: 'Lakeside modern high-rises, IT campuses, IIT Bombay, and planned townships.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'goregaon-west',
      name: 'Goregaon West',
      zone: 'Western Suburbs',
      rent: '₹26,000 - ₹65,000',
      description: 'Modern residential complexes close to Mindspace IT Park and Link Road hubs.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
    },
    {
      slug: 'thane-west',
      name: 'Thane',
      zone: 'Thane District',
      rent: '₹18,000 - ₹45,000',
      description: 'Expansive gated townships with lakes, malls, and spacious modern layouts.',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                Explore
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              Explore Mumbai by neighbourhood
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
              Find homes where you actually want to live with transparent rent benchmarks and verified transit connectivity.
            </p>
          </div>

          <Link
            href="/localities"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
          >
            <span>View all locations</span>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Locations Asymmetric Editorial Layout: 1 Large Locality + 4 Smaller Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ONE LARGE FEATURED LOCALITY (Andheri West - Left 6 Cols) */}
          <Link
            href={`/mumbai/${topLocalities[0].slug}`}
            className="lg:col-span-6 group relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-stone-200/90"
          >
            <Image
              src={topLocalities[0].image}
              alt={topLocalities[0].name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-2 text-white">
              <span className="bg-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md inline-block shadow-sm">
                {topLocalities[0].zone}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {topLocalities[0].name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md leading-relaxed">
                {topLocalities[0].description}
              </p>

              <div className="pt-3 flex items-center justify-between border-t border-white/20 text-xs font-bold">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase">Avg Rent Range</span>
                  <span className="text-white text-sm">{topLocalities[0].rent}</span>
                </div>
                <span className="text-purple-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform font-extrabold">
                  <span>Explore Andheri</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* FOUR SMALLER LOCALITIES (Right 6 Cols Grid) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {topLocalities.slice(1, 5).map((loc) => (
              <Link
                key={loc.slug}
                href={`/mumbai/${loc.slug}`}
                className="group relative rounded-3xl overflow-hidden min-h-[200px] sm:min-h-[220px] flex flex-col justify-end p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200/90"
              >
                <Image
                  src={loc.image}
                  alt={loc.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-0.5 text-white">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-300">
                    {loc.zone}
                  </span>
                  <h4 className="text-lg font-extrabold text-white leading-tight">
                    {loc.name}
                  </h4>
                  <p className="text-[11px] text-stone-300 font-semibold">
                    {loc.rent}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
