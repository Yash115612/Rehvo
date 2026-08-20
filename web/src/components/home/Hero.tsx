import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, PlusCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { generatePropertySlug, getSafeImageUrl } from '@/lib/seo/slugs';

interface HeroProps {
  primaryProperty?: PublicProperty | null;
}

export const Hero: React.FC<HeroProps> = ({ primaryProperty }) => {
  const propertyTitle = primaryProperty?.title || '3 BHK Designer Residence';
  const propertyLocality = primaryProperty?.locality || 'Bandra West';
  const propertyPrice = primaryProperty?.price || 120000;
  const propertySlug = primaryProperty ? generatePropertySlug(primaryProperty) : 'mumbai';
  const propertyImage = getSafeImageUrl(primaryProperty?.property_images?.[0]?.image_url, 0);

  return (
    <section className="relative bg-[#121118] text-white pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden border-b border-stone-800/80">
      {/* Ambient Lighting Accents */}
      <div className="absolute top-0 left-1/4 w-[650px] h-[650px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[550px] h-[550px] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Asymmetrical 40/60 Cover Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (~40% on Desktop / 5 Columns) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-purple-300 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Rent. Live. Belong.</span>
            </div>

            {/* Large Display Heading with Intentional Line Breaks */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Find a place <br />
              that feels like <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-200">
                home.
              </span>
            </h1>

            {/* Short Supporting Copy */}
            <p className="text-base sm:text-lg text-stone-300 max-w-md leading-relaxed font-normal">
              Flats, rooms, PGs and flatmates — all in one trusted place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/mumbai"
                className="bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Explore Homes</span>
                <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/owner/properties/new"
                className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-200 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>List Your Property</span>
              </Link>
            </div>

            {/* Trust Metric Checkmarks */}
            <div className="flex flex-wrap items-center gap-5 pt-3 text-xs font-bold text-stone-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Zero Brokerage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Direct Owner Chat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Physical Visits</span>
              </div>
            </div>
          </div>

          {/* Right Column (~60% on Desktop / 7 Columns) — Dominant Architectural Visual */}
          <div className="lg:col-span-7 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Visual Frame */}
              <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-[36px] overflow-hidden border-2 border-white/15 shadow-2xl shadow-purple-950/40 bg-stone-900">
                <Image
                  src={propertyImage}
                  alt={propertyTitle}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover scale-[1.02] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

                {/* Caption on Image */}
                <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 block">
                      {propertyLocality} • Mumbai
                    </span>
                    <h3 className="font-extrabold text-xl sm:text-2xl text-white leading-tight mt-0.5">
                      {propertyTitle}
                    </h3>
                    <p className="text-xs text-stone-300 font-semibold mt-1">
                      ₹{propertyPrice.toLocaleString('en-IN')}/mo • 0% Brokerage
                    </p>
                  </div>

                  <Link
                    href={primaryProperty ? `/property/${propertySlug}` : '/mumbai'}
                    className="hidden sm:inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    <span>View Home</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Floating Zero-Commission Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 border border-stone-200 shadow-2xl text-stone-900 hidden sm:flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 font-extrabold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                    Guaranteed Zero Fee
                  </span>
                  <span className="text-xs font-extrabold text-stone-900">
                    Saved ₹45,000 - ₹90,000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
