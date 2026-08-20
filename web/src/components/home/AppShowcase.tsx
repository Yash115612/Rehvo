import React from 'react';
import { Smartphone } from 'lucide-react';

export const AppShowcase: React.FC = () => {
  return (
    <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Mobile Experience
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Take REHVO wherever you go.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Search, chat, schedule visits, and manage your place from anywhere on iOS and Android.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200/80 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>iOS App • Coming Soon</span>
              </span>
              <span className="text-xs font-bold text-stone-700 bg-stone-100 border border-stone-200/80 px-4 py-2.5 rounded-xl flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span>Android App • Coming Soon</span>
              </span>
            </div>
          </div>

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Smartphone className="w-12 h-12" />
          </div>
        </div>
      </div>
    </section>
  );
};
