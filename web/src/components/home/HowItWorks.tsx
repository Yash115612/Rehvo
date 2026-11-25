'use client';

import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  FileCheck,
  ClipboardList,
  Key,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

interface JourneyStep {
  title: string;
  desc: string;
  icon: React.ElementType;
}

const RENTER_STEPS: JourneyStep[] = [
  {
    title: '1. Discover',
    desc: 'Browse verified, zero-brokerage homes with confirmed locations, pricing, and genuine photographs.',
    icon: Search,
  },
  {
    title: '2. Connect & Visit',
    desc: 'Schedule physical visits or live video walkthroughs directly with the homeowner.',
    icon: MessageSquare,
  },
  {
    title: '3. Apply & Agree',
    desc: 'Review lease terms, security deposit requirements, and standard digital agreement clauses.',
    icon: FileCheck,
  },
  {
    title: '4. Baseline Inspection',
    desc: 'Complete the room-by-room move-in condition checklist and capture timestamped evidence photos.',
    icon: ClipboardList,
  },
  {
    title: '5. Move In',
    desc: 'Exchange keys with the verified handover confirmation and move into your new home with confidence.',
    icon: Key,
  },
];

const OWNER_STEPS: JourneyStep[] = [
  {
    title: '1. List Property',
    desc: 'Post your apartment, PG, or commercial space free with specifications, rules, and photos.',
    icon: ClipboardList,
  },
  {
    title: '2. Verify Ownership',
    desc: 'Submit property title deed or utility bill confirmation to earn the official REHVO Verified Owner badge.',
    icon: ShieldCheck,
  },
  {
    title: '3. Connect with Renters',
    desc: 'Receive direct enquiries, confirm scheduled visit slots, and chat with prospective tenants.',
    icon: MessageSquare,
  },
  {
    title: '4. Document Condition',
    desc: 'Review and acknowledge the tenant’s move-in condition baseline record before physical key handover.',
    icon: FileCheck,
  },
  {
    title: '5. Manage Tenancy',
    desc: 'Track maintenance requests, execute move-out comparison, and settle security deposits transparently.',
    icon: CheckCircle,
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter');
  const steps = activeTab === 'renter' ? RENTER_STEPS : OWNER_STEPS;

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-rehvo-border-subtle">
      <Container size="wide">
        <div className="flex flex-col items-center text-center">
          <SectionHeading
            eyebrow="Simple & Transparent"
            title="How renting works on REHVO"
            subtitle="A clear, structured journey designed to keep both tenants and homeowners aligned at every step."
            align="center"
          />

          {/* Toggle Role Selector */}
          <div className="mt-8 inline-flex items-center rounded-xl border border-rehvo-border bg-rehvo-surface-subtle p-1">
            <button
              type="button"
              onClick={() => setActiveTab('renter')}
              className={cn(
                'rounded-lg px-5 py-2 text-xs font-bold transition-colors select-none',
                activeTab === 'renter'
                  ? 'bg-rehvo-navy text-white shadow-xs'
                  : 'text-rehvo-secondary hover:text-rehvo-navy'
              )}
            >
              For Renters
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('owner')}
              className={cn(
                'rounded-lg px-5 py-2 text-xs font-bold transition-colors select-none',
                activeTab === 'owner'
                  ? 'bg-rehvo-navy text-white shadow-xs'
                  : 'text-rehvo-secondary hover:text-rehvo-navy'
              )}
            >
              For Property Owners
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative flex flex-col justify-between rounded-2xl border border-rehvo-border bg-white p-6 shadow-card transition-all hover:border-rehvo-border-focus hover:shadow-card-hover"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rehvo-orange-soft text-rehvo-orange">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-rehvo-navy">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-rehvo-secondary">{step.desc}</p>
                </div>
                <div className="mt-6 border-t border-rehvo-border-subtle pt-3 text-[11px] font-bold uppercase tracking-wider text-rehvo-muted">
                  Step 0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
