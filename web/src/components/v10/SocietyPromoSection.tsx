import React from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  QrCode,
  CreditCard,
  CalendarCheck,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: QrCode,
    title: 'QR Visitor Passes',
    desc: 'Instant pre-approval for guests & deliveries via WhatsApp',
  },
  {
    icon: CreditCard,
    title: 'Maintenance Payments',
    desc: 'Automated UPI & card collections with instant PDF receipts',
  },
  {
    icon: CalendarCheck,
    title: 'Amenity Bookings',
    desc: 'Reserve clubhouses, sports courts & lawns without conflicts',
  },
  {
    icon: ShieldCheck,
    title: 'Gate-to-App Intercom',
    desc: 'Guard desk security calls directly on resident smartphones',
  },
];

export const SocietyPromoSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[40px] bg-gradient-to-br from-[#031B2A] via-[#042838] to-[#064E3B] text-white p-5 xs:p-6 sm:p-12 lg:p-16 shadow-2xl border border-white/10">
        {/* Glow Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0F766E]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-10">
          {/* Left Column: Heading & Description */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#5EEAD4] text-[10px] sm:text-xs font-black uppercase tracking-wider max-w-full truncate">
              <Building2 className="w-3.5 h-3.5 text-[#5EEAD4] shrink-0" />
              <span className="truncate">Gated Community Operating System</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Smart Society Management for Apartments &amp; RWAs
            </h2>

            <p className="text-xs sm:text-base text-slate-300 font-medium leading-relaxed">
              Upgrade your housing society in Mumbai from paper logbooks and noisy chat groups to a unified digital operating system. Seamless gate security, zero-surcharge maintenance billing, and verified staff management.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/society-services"
                className="h-11 sm:h-13 px-6 sm:px-8 rounded-full bg-[#10B981] hover:bg-[#059669] text-[#031B2A] hover:text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all duration-200"
              >
                <span>Onboard Your Society</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="h-11 sm:h-13 px-6 sm:px-7 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition"
              >
                <span>Book Free Demo</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 4-Feature Grid */}
          <div className="w-full lg:max-w-md grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {HIGHLIGHTS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-3.5 sm:p-4 space-y-1.5 sm:space-y-2 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0F766E]/40 border border-[#2DD4BF]/30 flex items-center justify-center text-[#5EEAD4]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-black text-white">{item.title}</h3>
                  <p className="text-[11px] text-slate-300/80 leading-snug font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
