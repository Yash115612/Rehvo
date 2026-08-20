import React from 'react';
import Link from 'next/link';

export const FinalCTA: React.FC = () => {
  return (
    <section className="bg-[#0E0D14] text-white py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Your next place <br />
          could be closer <br />
          than you think.
        </h2>

        <p className="text-sm sm:text-base text-stone-400 max-w-xl mx-auto">
          Join thousands of renters and verified homeowners discovering modern zero-brokerage living in Mumbai.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/mumbai"
            className="bg-white hover:bg-stone-100 text-stone-950 font-extrabold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl transition"
          >
            Explore Homes
          </Link>

          <Link
            href="/owner/properties/new"
            className="bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl border border-white/20 backdrop-blur-md transition"
          >
            List Your Property
          </Link>
        </div>
      </div>
    </section>
  );
};
