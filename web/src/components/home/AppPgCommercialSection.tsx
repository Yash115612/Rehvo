import React from 'react';
import Link from 'next/link';
import { Building, Briefcase, ArrowRight, Check, Wifi, Coffee, ShieldCheck, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function AppPgCommercialSection() {
  return (
    <section className="py-14 sm:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: PG & Co-Living Spotlight */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 text-sky-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Building className="h-3.5 w-3.5 text-sky-600" />
                  PG &amp; Co-Living
                </span>
                <span className="text-xs font-bold text-[#F97316]">Zero Deposit Options</span>
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl font-black text-[#001741]">
                Furnished PGs &amp; Hostels in Mumbai
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Move into ready-to-live spaces with air conditioning, daily housekeeping, fast WiFi, and flexible notice periods near top tech parks and universities.
              </p>

              {/* Amenity Pills */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-4 w-4 text-sky-600 shrink-0" />
                  <span>High-Speed WiFi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coffee className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Meal Plans Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>CCTV &amp; Biometric Entry</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No Lock-In Penalties</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Starting from</p>
                <p className="text-lg font-black text-[#001741]">
                  ₹9,500 <span className="text-xs font-medium text-slate-500">/bed/mo</span>
                </p>
              </div>
              <Link
                href="/pg"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#001741] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0B1F3A] transition-colors"
              >
                <span>Browse PGs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Commercial & Office Spaces Spotlight */}
          <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                  Commercial Real Estate
                </span>
                <span className="text-xs font-bold text-[#059669]">0% Brokerage</span>
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl font-black text-[#001741]">
                Offices, Showrooms &amp; Retail Shops
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Lease commercial spaces direct from building owners in BKC, Lower Parel, Andheri East, and Navi Mumbai without heavy commercial broker fees.
              </p>

              {/* Amenity Pills */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Carpet Area Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Power Backup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dedicated Parking Bays</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
                  <span>Metro &amp; Highway Connectivity</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-400">Available Spaces</p>
                <p className="text-lg font-black text-[#001741]">
                  500 – 25,000 <span className="text-xs font-medium text-slate-500">sq.ft</span>
                </p>
              </div>
              <Link
                href="/commercial"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F97316] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#EA580C] transition-colors"
              >
                <span>Browse Commercial</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
