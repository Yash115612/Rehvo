import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import { PublicFlatmate } from '@/lib/seo/types';

interface FlatmateShowcaseProps {
  flatmates: PublicFlatmate[];
}

export const FlatmateShowcase: React.FC<FlatmateShowcaseProps> = ({ flatmates }) => {
  const primaryFlatmate = flatmates[0] || null;
  const secondaryFlatmates = flatmates.slice(1, 4);

  return (
    <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest">
                Roommates
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.1]">
              Find your flatmate.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal leading-relaxed pt-0.5">
              Connect directly with verified working professionals and students with aligned routines and room budgets.
            </p>
          </div>

          <Link
            href="/flatmates/mumbai"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-stone-900 hover:text-purple-600 transition flex-shrink-0"
          >
            <span>Find Your Flatmate →</span>
          </Link>
        </div>

        {/* Social Roommates Editorial Composition */}
        {flatmates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Primary Large Flatmate Card (Left 5 Cols) */}
            {primaryFlatmate && (
              <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-8 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    {primaryFlatmate.photo ? (
                      <Image
                        src={primaryFlatmate.photo}
                        alt={primaryFlatmate.name}
                        width={72}
                        height={72}
                        className="w-18 h-18 rounded-2xl object-cover border border-stone-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-18 h-18 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-3xl">
                        {primaryFlatmate.profession?.charAt(0) || 'R'}
                      </div>
                    )}

                    <div>
                      <span className="bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full inline-block mb-1">
                        Featured Flatmate
                      </span>
                      <h4 className="text-xl font-extrabold text-stone-900 leading-tight">
                        {primaryFlatmate.name}
                        {primaryFlatmate.age ? `, ${primaryFlatmate.age}` : ''}
                      </h4>
                      <p className="text-xs font-semibold text-stone-500">{primaryFlatmate.profession}</p>
                      <span className="text-xs font-extrabold text-purple-700 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {primaryFlatmate.locality}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {primaryFlatmate.bio ||
                      'Looking for a clean, peaceful shared apartment with reliable Wi-Fi and respectful working professionals.'}
                  </p>

                  {primaryFlatmate.lifestyle_preferences && primaryFlatmate.lifestyle_preferences.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {primaryFlatmate.lifestyle_preferences.map((tag) => (
                        <span
                          key={tag}
                          className="bg-stone-100 border border-stone-200/80 text-stone-700 text-[11px] font-bold px-3 py-1 rounded-xl"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase block">Max Budget</span>
                    <span className="text-sm font-extrabold text-stone-900">
                      ₹{primaryFlatmate.budget_max?.toLocaleString('en-IN')}/mo
                    </span>
                  </div>

                  <Link
                    href={`/flatmates/${primaryFlatmate.id}`}
                    className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm"
                  >
                    Connect →
                  </Link>
                </div>
              </div>
            )}

            {/* 3 Secondary Flatmate Profile Cards (Right 7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {secondaryFlatmates.map((f) => (
                <div
                  key={f.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {f.photo ? (
                        <Image
                          src={f.photo}
                          alt={f.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-lg">
                          {f.profession?.charAt(0) || 'R'}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-extrabold text-stone-900 leading-tight">
                          {f.name}
                          {f.age ? `, ${f.age}` : ''}
                        </h4>
                        <span className="text-[10px] font-extrabold text-purple-700 flex items-center gap-0.5 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {f.locality}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500 font-medium line-clamp-2">
                      {f.profession || 'Working Professional'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-900">
                      ₹{f.budget_max?.toLocaleString('en-IN')}/mo
                    </span>

                    <Link
                      href={`/flatmates/${f.id}`}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-900 text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 space-y-3 shadow-sm">
            <Users className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-sm font-bold text-stone-900">Flatmate profiles being verified</h3>
            <Link
              href="/flatmates/create"
              className="inline-block bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
            >
              Create First Profile
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
