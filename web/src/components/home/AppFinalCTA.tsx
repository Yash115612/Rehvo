import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, PlusCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function AppFinalCTA() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <Container size="wide">
        <div className="relative overflow-hidden rounded-3xl bg-[#001741] px-6 py-12 sm:px-12 sm:py-16 text-white shadow-2xl">
          {/* Subtle Glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#0284C7]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#F97316]/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#F97316]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>India&apos;s Rental Marketplace</span>
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl text-white">
              Ready to find your next home?
            </h2>

            <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
              Join thousands of renters and property owners discovering zero-brokerage homes with verified condition baselines and digital lease agreements.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-transform duration-150 hover:bg-[#EA580C] hover:scale-105 active:scale-95"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Browse Rentals</span>
              </Link>

              <Link
                href="/list-property"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/20"
              >
                <PlusCircle className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
                <span>List Property Free</span>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                Zero Brokerage Guaranteed
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                Move-In Damage Protection
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                Direct Owner Contact
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
