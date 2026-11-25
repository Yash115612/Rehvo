import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileSearch,
  MessageSquare,
  Camera,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';

const PILLARS = [
  {
    icon: FileSearch,
    title: 'Property Deed Verification',
    desc: 'Owners submit ownership deeds or electricity utility records to verify genuine possession and eliminate phantom listings.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Brokerage Transparency',
    desc: 'All listings are directly from homeowners or authorized entities with transparent rent and deposit terms stated up front.',
  },
  {
    icon: MessageSquare,
    title: 'Safer Platform Communication',
    desc: 'In-app chat and confirmed visit scheduling keep personal contact details secure until you are ready to visit.',
  },
  {
    icon: Camera,
    title: 'Immutable Condition Records',
    desc: 'Move-in inspection photos and videos are stored in tamper-evident records to protect both parties during tenancy.',
  },
  {
    icon: Scale,
    title: 'Neutral Mediation & Support',
    desc: 'If disagreements arise regarding move-out repairs, REHVO Trust & Safety reviews objective baseline evidence.',
  },
];

export function TrustSafety() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-rehvo-border-subtle">
      <Container size="wide">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          
          {/* Left Column: Context & CTA */}
          <div className="flex flex-col lg:col-span-5">
            <SectionHeading
              eyebrow="Security & Governance"
              title="A marketplace built on verifiable trust"
              subtitle="We believe Indian renting should not rely on unverified broker promises. Every critical milestone is backed by objective documentation."
            />

            <div className="mt-8 flex flex-col gap-4">
              <div className="rounded-2xl border border-rehvo-border bg-rehvo-surface-subtle p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-rehvo-orange-active">
                  Our Security Standard
                </p>
                <p className="mt-1 text-sm font-semibold text-rehvo-navy">
                  No hidden brokerage fees. No fake reviews. No unverified deposit deductions.
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-rehvo-secondary">
                  Every property inspection baseline is co-acknowledged by both owner and renter before keys are released.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button href="/safety" variant="navy" size="md">
                  <span>Visit Safety Center</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button href="/contact" variant="secondary" size="md">
                  <span>Contact Support</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Pillars List */}
          <div className="flex flex-col gap-4 lg:col-span-7">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex items-start gap-4 rounded-2xl border border-rehvo-border bg-white p-5 shadow-xs transition-colors hover:border-rehvo-border-focus"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rehvo-orange-soft text-rehvo-orange">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rehvo-navy">{pillar.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-rehvo-secondary">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </Container>
    </section>
  );
}
