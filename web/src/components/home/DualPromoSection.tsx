import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronRight, Smartphone } from 'lucide-react';

export const DualPromoSection: React.FC = () => {
  return (
    <section className="bg-[#F8FAFC] py-16 sm:py-24 border-b border-stone-200/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* CARD 1: Host CTA Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center overflow-hidden">
            {/* Left Copy (7 Cols) */}
            <div className="sm:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                Have a place to rent?
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed">
                List it on REHVO and connect with thousands of genuine seekers.
              </p>

              <div className="pt-2">
                <Link
                  href="/owner/properties/new"
                  className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg shadow-teal-800/20 transition group"
                >
                  <span>List Your Property</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Architectural Image (5 Cols) */}
            <div className="sm:col-span-5 relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"
                alt="Modern contemporary house for rent in Mumbai"
                fill
                sizes="(max-width: 640px) 100vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* CARD 2: App Showcase Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center overflow-hidden relative">
            {/* Left Copy (7 Cols) */}
            <div className="sm:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                Take REHVO <br />
                wherever you go.
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed">
                Search, chat, schedule visits and more on the go.
              </p>

              {/* App Store Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <div className="bg-stone-900 text-white px-3.5 py-2 rounded-xl flex items-center gap-2 text-left cursor-default shadow-sm">
                  <div className="text-base font-bold">▶</div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-stone-400 block leading-none">GET IT ON</span>
                    <span className="text-xs font-bold leading-tight">Google Play</span>
                  </div>
                </div>

                <div className="bg-stone-900 text-white px-3.5 py-2 rounded-xl flex items-center gap-2 text-left cursor-default shadow-sm">
                  <div className="text-base font-bold"></div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-stone-400 block leading-none">Download on the</span>
                    <span className="text-xs font-bold leading-tight">App Store</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Phone Mockup (5 Cols) */}
            <div className="sm:col-span-5 relative aspect-[9/14] sm:aspect-[9/13] max-w-[170px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-900 bg-stone-950">
              <Image
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=80"
                alt="REHVO Mobile App Interface"
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-950/20" />
              {/* App UI Overlay Mockup */}
              <div className="absolute top-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-xl p-2 text-stone-900 text-[9px] font-bold shadow-sm">
                <div className="flex items-center justify-between text-[#0F766E]">
                  <span>REHVO App</span>
                  <span>2.4k listings</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator Button */}
            <button
              type="button"
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg border border-stone-200 hidden xl:flex items-center justify-center text-stone-600 hover:text-[#0F766E]"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
