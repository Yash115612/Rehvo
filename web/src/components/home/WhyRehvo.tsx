import React from 'react';

export const WhyRehvo: React.FC = () => {
  return (
    <section className="bg-[#121118] text-white py-24 sm:py-32 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Side: Statement Display Typography */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest block">
              The Standard
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08]">
              Find better. <br />
              Connect directly. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
                Move confidently.
              </span>
            </h2>
            <p className="text-sm text-stone-400 max-w-sm pt-2 leading-relaxed">
              REHVO is engineered to remove predatory broker commissions and bring transparent rental living to Mumbai.
            </p>
          </div>

          {/* Right Side: Editorial Rows with Thin Hairline Separators */}
          <div className="lg:col-span-7 space-y-8 divide-y divide-white/10">
            <div className="pt-6 first:pt-0 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-purple-400">01</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Verified & Genuine</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                Every property and flatmate profile is physically checked and verified to eliminate fake listings, ghost owners, and duplicate brokers.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-purple-400">02</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Direct Conversations</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                Live real-time messaging directly between homeowners and tenants with zero broker interference or phone number leakage.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-purple-400">03</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Easy Scheduling</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                Pick your preferred on-site visit date and time slot. Hosts confirm walkthroughs instantly without back-and-forth phone calls.
              </p>
            </div>

            <div className="pt-6 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-purple-400">04</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Secure & Trusted</h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-7">
                100% zero brokerage policy. Keep your hard-earned 1-2 months’ deposit savings entirely in your own pocket.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
