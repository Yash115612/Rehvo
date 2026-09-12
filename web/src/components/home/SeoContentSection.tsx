import React from 'react';
import Link from 'next/link';

export const SeoContentSection: React.FC = () => {
  return (
    <section className="py-12 bg-[#F8FAFC] border-b border-stone-200/80 text-stone-600 text-xs sm:text-sm leading-relaxed">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <h2 className="text-base sm:text-lg font-extrabold text-stone-900 mb-3 tracking-tight">
            Verified Rentals, Commercial Spaces & Flatmates Across Mumbai
          </h2>
          <p className="mb-3 text-stone-600 leading-relaxed">
            REHVO is Mumbai's premier direct-to-owner property marketplace. Whether you are searching for a{' '}
            <Link href="/mumbai/andheri-west/1-bhk-flats-for-rent" className="font-bold text-stone-900 hover:text-[#0F766E]">
              1 BHK in Andheri West
            </Link>
            , a spacious{' '}
            <Link href="/mumbai/bandra-west/2-bhk-flats-for-rent" className="font-bold text-stone-900 hover:text-[#0F766E]">
              2 BHK in Bandra
            </Link>
            , a premium corporate office in{' '}
            <Link href="/commercial" className="font-bold text-stone-900 hover:text-[#0F766E]">
              Bandra Kurla Complex (BKC)
            </Link>
            , or a furnished student PG near{' '}
            <Link href="/pg-rooms" className="font-bold text-stone-900 hover:text-[#0F766E]">
              Powai
            </Link>
            , REHVO connects you directly with verified landlords and flatmates.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Say goodbye to hidden fees, fake listing photos, and unverified listings. With in-app direct messaging, confirmed physical visit bookings, and verified tenant profiles, REHVO delivers a completely transparent renting experience across Western Suburbs, South Mumbai, Central Suburbs, Thane, and Navi Mumbai.
          </p>
        </div>
      </div>
    </section>
  );
};
