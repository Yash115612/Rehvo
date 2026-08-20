import React from 'react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="bg-[#FAF9F6] py-20 sm:py-28 border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Journey
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            Simple from search to move-in
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Three seamless steps designed to save you weeks of broker calls and wasted visits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <span className="text-5xl font-extrabold text-purple-600/30 font-mono block">01</span>
            <h3 className="text-xl font-extrabold text-stone-900">Discover & Filter</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Browse verified properties, single rooms, or roommates filtered by locality, budget brackets, and furnishing state.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-5xl font-extrabold text-purple-600/30 font-mono block">02</span>
            <h3 className="text-xl font-extrabold text-stone-900">Connect & Schedule</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Start a live chat thread with the owner and book a physical on-site visit slot that fits your personal schedule.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-5xl font-extrabold text-purple-600/30 font-mono block">03</span>
            <h3 className="text-xl font-extrabold text-stone-900">Visit & Move In</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Agree on rental terms directly with the host. No hidden commissions, zero broker interference, and complete transparency.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
