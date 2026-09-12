import React from 'react';
import Link from 'next/link';
import { Smartphone, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface AppDownloadBannerProps {
  propertyId?: string;
}

export const AppDownloadBanner: React.FC<AppDownloadBannerProps> = ({ propertyId }) => {
  const deepLink = propertyId ? `rehvo://property/${propertyId}` : 'rehvo://home';

  return (
    <section className="bg-gradient-to-br from-stone-900 via-stone-900 to-[#064E3B] text-white rounded-3xl p-8 sm:p-10 shadow-xl overflow-hidden relative border border-[#0F766E]/30 my-10">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#0F766E]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#0F766E]/20 border border-[#0F766E]/30 text-[#CCFBF1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Direct Host Connection
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Rent With Verified Owners & Brokers
          </h2>

          <p className="text-sm text-stone-300 max-w-xl leading-relaxed">
            Download the REHVO mobile app to chat directly with verified homeowners, schedule in-person visits, submit zero-deposit rental applications, and connect with prospective roommates.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-stone-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Owners</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Instant In-App Chat</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
          <Link
            href={deepLink}
            className="w-full bg-white hover:bg-stone-100 text-stone-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
          >
            <Smartphone className="w-4 h-4 text-[#0F766E]" />
            <span>Open in REHVO App</span>
          </Link>
          <Link
            href="/download"
            className="w-full bg-[#0F766E]/30 hover:bg-[#0F766E]/40 border border-[#0F766E]/40 text-white font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center text-xs"
          >
            Download for Android & iOS
          </Link>
        </div>
      </div>
    </section>
  );
};
