import React from 'react';
import Link from 'next/link';
import { PlusCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import {
  HostEarnCard1Illustration,
  HostEarnCard2Illustration,
  HostEarnCard3Illustration,
} from '@/components/illustrations/RehvoIllustrations';

export function AppHostAndEarn() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <Container size="wide">
        <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-10 shadow-sm">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                Homeowner &amp; Host Hub
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#001741]">
                Host and Earn with REHVO
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                List your residential or commercial space for free and connect directly with verified renters.
              </p>
            </div>

            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 rounded-xl bg-[#001741] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0B1F3A] shadow-md shrink-0"
            >
              <PlusCircle className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
              <span>List Property Free</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* 3 Pastel Cards Row (Exact Mobile App Host & Earn DNA) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Soft Cyan */}
            <div className="flex flex-col justify-between rounded-2xl border border-sky-100 bg-[#E0F2FE] p-6 transition-all hover:shadow-md">
              <div>
                <span className="rounded-full bg-sky-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-800">
                  Zero Commission
                </span>
                <h3 className="mt-3 text-lg font-black text-[#001741]">
                  Earn from your idle property
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                  Keep 100% of your rental income. REHVO charges zero brokerage or middleman listing fees.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <HostEarnCard1Illustration size={68} />
                <Link
                  href="/list-property"
                  className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1"
                >
                  <span>Start hosting</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Soft Sage Green */}
            <div className="flex flex-col justify-between rounded-2xl border border-emerald-100 bg-[#DCFCE7] p-6 transition-all hover:shadow-md">
              <div>
                <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Verified Tenants
                </span>
                <h3 className="mt-3 text-lg font-black text-[#001741]">
                  Hassle-free verified occupants
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                  Pre-screened profiles, confirmed employment backgrounds, and digital police intimation support.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <HostEarnCard2Illustration size={68} />
                <Link
                  href="/safety"
                  className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1"
                >
                  <span>View trust standards</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 3: Soft Amber */}
            <div className="flex flex-col justify-between rounded-2xl border border-amber-100 bg-[#FEF3C7] p-6 transition-all hover:shadow-md">
              <div>
                <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900">
                  Yield Calculator
                </span>
                <h3 className="mt-3 text-lg font-black text-[#001741]">
                  Calculate your rental yield
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                  Compare prevailing neighborhood rental rates across Bandra, Andheri, Powai, and South Mumbai.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <HostEarnCard3Illustration size={68} />
                <Link
                  href="/reports"
                  className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1"
                >
                  <span>See market reports</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

          </div>

          {/* Micro trust checklist */}
          <div className="mt-8 flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-6 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
              100% Free Listing
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
              Direct Tenant Chat
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" aria-hidden="true" />
              Pre-Move-In Condition Inspection
            </span>
          </div>

        </div>
      </Container>
    </section>
  );
}
