import React from 'react';
import Link from 'next/link';
import {
  ClipboardCheck,
  Camera,
  CheckCircle2,
  GitCompare,
  Scale,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const STEPS = [
  {
    step: '01',
    title: 'Room-by-Room Move-In Inspection',
    desc: 'Before key handover, the property condition is checked room-by-room across walls, fittings, appliances and meters.',
    icon: ClipboardCheck,
  },
  {
    step: '02',
    title: 'Photo & Video Evidence Record',
    desc: 'Timestamped photos and videos document pre-existing scratches, marks or operational status into an immutable record.',
    icon: Camera,
  },
  {
    step: '03',
    title: 'Mutual Acknowledgement & Handover',
    desc: 'Both owner and renter verify and acknowledge the baseline condition before physical key handover and activation.',
    icon: CheckCircle2,
  },
  {
    step: '04',
    title: 'Side-by-Side Move-Out Comparison',
    desc: 'At move-out, condition photos are directly compared side-by-side with the move-in baseline to separate new damage from normal wear.',
    icon: GitCompare,
  },
  {
    step: '05',
    title: 'Objective Dispute Handling',
    desc: 'If disagreements arise on deposit deductions, REHVO Trust & Safety reviews the verified baseline evidence objectively.',
    icon: Scale,
  },
];

export function DamageProtectionExplainer() {
  return (
    <section className="py-16 sm:py-24 bg-rehvo-navy text-white relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-rehvo-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rehvo-navy-muted/30 blur-3xl" />

      <Container size="wide">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-rehvo-orange/30 bg-rehvo-orange/10 px-3 py-1 text-xs font-bold text-rehvo-orange">
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            Core Trust & Safety Innovation
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            REHVO Verified Handover &amp; Damage Protection
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Inspired by transparent vehicle rental inspections, REHVO establishes a mutually acknowledged record of a property&apos;s condition before occupancy—preventing tenants from being charged for pre-existing wear and tear.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-rehvo-navy-secondary p-6 transition-colors hover:border-rehvo-orange/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-rehvo-orange">{item.step}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-rehvo-orange">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-white leading-snug">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Disclaimer & CTA Box */}
        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:flex-row sm:items-center">
          <div className="max-w-2xl text-xs leading-relaxed text-slate-300">
            <strong className="font-semibold text-white">Transparency Notice: </strong>
            REHVO Damage Protection is an evidence-based condition documentation and dispute mitigation system, not an insurance policy or financial guarantee scheme.
          </div>
          <Button href="/safety" variant="primary" size="md" className="shrink-0 font-bold">
            <span>Read Damage Protection Guide</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
