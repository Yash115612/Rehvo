import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, ChevronRight, Users } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';

interface FindFlatmateProps {
  flatmates: PublicFlatmate[];
}

export const FindFlatmate: React.FC<FindFlatmateProps> = ({ flatmates }) => {
  // Default verified profiles matching reference if DB has limited entries
  const displayFlatmates = [
    {
      id: flatmates[0]?.id || 'f1',
      name: flatmates[0]?.name || 'Riya Sharma',
      photo: flatmates[0]?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      locality: flatmates[0]?.locality || 'Andheri West',
      budget: flatmates[0]?.budget_max || 13000,
      lookingFor: 'Female',
      tags: ['Working', 'Non Veg'],
    },
    {
      id: flatmates[1]?.id || 'f2',
      name: flatmates[1]?.name || 'Arjun Patel',
      photo: flatmates[1]?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      locality: flatmates[1]?.locality || 'Powai',
      budget: flatmates[1]?.budget_max || 15000,
      lookingFor: 'Male',
      tags: ['Working', 'Veg'],
    },
    {
      id: flatmates[2]?.id || 'f3',
      name: flatmates[2]?.name || 'Neha Singh',
      photo: flatmates[2]?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      locality: flatmates[2]?.locality || 'Bandra',
      budget: flatmates[2]?.budget_max || 14000,
      lookingFor: 'Female',
      tags: ['Student', 'Veg'],
    },
    {
      id: flatmates[3]?.id || 'f4',
      name: flatmates[3]?.name || 'Karan Mehta',
      photo: flatmates[3]?.photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      locality: flatmates[3]?.locality || 'Goregaon East',
      budget: flatmates[3]?.budget_max || 12000,
      lookingFor: 'Male',
      tags: ['Working', 'Non Veg'],
    },
  ];

  return (
    <section className="bg-[#FAF8F5] py-16 sm:py-24 border-b border-stone-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (~30% on Desktop / 3.5 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] font-extrabold text-[#FF5533] uppercase tracking-wider block">
              COMMUNITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Find Your Flatmate
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed max-w-sm">
              Meet amazing people and find your perfect match.
            </p>

            <div className="pt-2">
              <Link
                href="/flatmates/mumbai"
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-900 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full border border-stone-200 shadow-sm transition"
              >
                <span>Browse Flatmates</span>
                <ArrowRight className="w-4 h-4 text-[#FF5533]" />
              </Link>
            </div>
          </div>

          {/* Right Column: 4 Flatmate Cards Grid (~70% on Desktop / 8.5 Cols) */}
          <div className="lg:col-span-8 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayFlatmates.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between text-center relative space-y-3"
                >
                  {/* Top Heart Icon */}
                  <button
                    type="button"
                    className="absolute top-3.5 right-3.5 text-stone-400 hover:text-[#FF5533] p-1"
                    aria-label="Save flatmate profile"
                  >
                    <Heart className="w-4 h-4" />
                  </button>

                  {/* Circular Avatar */}
                  <div className="mx-auto pt-2">
                    <Image
                      src={f.photo}
                      alt={f.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover border-2 border-orange-100 shadow-sm mx-auto"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-stone-900 leading-tight">
                      {f.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium">
                      {f.locality}
                    </p>
                    <p className="text-[11px] font-bold text-stone-700 pt-0.5">
                      ₹{f.budget.toLocaleString('en-IN')} <span className="text-[10px] text-stone-400 font-normal">· Looking for {f.lookingFor}</span>
                    </p>
                  </div>

                  {/* Lifestyle Tags */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                    {f.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-stone-50 border border-stone-200/80 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator Button */}
            <Link
              href="/flatmates/mumbai"
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-stone-200 hidden xl:flex items-center justify-center text-stone-600 hover:text-[#FF5533] hover:scale-105 transition"
              aria-label="View more flatmates"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
