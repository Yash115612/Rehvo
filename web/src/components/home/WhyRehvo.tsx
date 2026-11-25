import React from 'react';
import {
  Percent,
  ShieldCheck,
  Eye,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const REASONS = [
  {
    icon: Percent,
    title: 'Zero Brokerage',
    description:
      'Rent direct from homeowners. No middleman brokerage fees, commission cuts, or artificial price markups.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Property Data',
    description:
      'Real photographs, confirmed physical addresses, and owner verification to eliminate phantom or duplicate listings.',
  },
  {
    icon: Eye,
    title: 'Complete Price Transparency',
    description:
      'Exact rent, security deposit, maintenance fees, and notice periods clearly stated before you book a visit.',
  },
  {
    icon: FileCheck2,
    title: 'Digital Rental Journey',
    description:
      'Schedule visits with confirmed time slots, message owners in-platform, and access standard digital lease agreements.',
  },
  {
    icon: ShieldAlert,
    title: 'Condition Baseline & Protection',
    description:
      'Dual-party photo records at move-in establish an objective baseline so you are never charged for pre-existing wear.',
  },
];

export function WhyRehvo() {
  return (
    <section className="py-14 sm:py-20 bg-rehvo-surface-subtle border-b border-rehvo-border-subtle">
      <Container size="wide">
        <SectionHeading
          eyebrow="The REHVO Difference"
          title="Renting made transparent, safe and direct"
          subtitle="A modern rental marketplace designed to protect both renters and property owners from traditional friction."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="flex flex-col rounded-2xl border border-rehvo-border bg-white p-7 shadow-card transition-all hover:border-rehvo-border-focus hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rehvo-navy text-rehvo-orange">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-rehvo-navy">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-rehvo-secondary">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
