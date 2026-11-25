import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Briefcase,
  Wrench,
  Building,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const ECOSYSTEM_SERVICES = [
  {
    title: 'PG & Co-Living Communities',
    desc: 'Browse single and shared rooms with high-speed WiFi, meal services, housekeeping, and transparent security deposit terms.',
    href: '/pg',
    icon: Building2,
    badge: 'Co-Living',
  },
  {
    title: 'Flatmate Finder',
    desc: 'Connect with compatible flatmates across Mumbai by lifestyle, budget, dietary habits, and preferred move-in dates.',
    href: '/flatmates',
    icon: Users,
    badge: 'Vetted Profiles',
  },
  {
    title: 'Commercial Real Estate',
    desc: 'Direct lease office spaces, retail shops, warehouses, and co-working desks without middleman commercial brokerage.',
    href: '/commercial',
    icon: Briefcase,
    badge: 'Zero Brokerage',
  },
  {
    title: 'On-Demand Home Services',
    desc: 'Deep cleaning, plumbing, electrical maintenance, AC service, painting, and moving assistance backed by verified partners.',
    href: '/services',
    icon: Wrench,
    badge: 'Home Care',
  },
  {
    title: 'Smart Society Services',
    desc: 'Digital gate management, tenant move-in/move-out NOC coordination, and community billing for housing societies.',
    href: '/society-services',
    icon: Building,
    badge: 'For RWAs',
  },
  {
    title: 'Prime Mumbai Localities',
    desc: 'Explore curated neighborhood guides, average rental yields, and verified homes across Bandra, Andheri, Powai, and Worli.',
    href: '/search',
    icon: MapPin,
    badge: 'Neighborhoods',
  },
];

export function EcosystemShowcase() {
  return (
    <section className="py-14 sm:py-20 bg-rehvo-surface-subtle border-b border-rehvo-border-subtle">
      <Container size="wide">
        <SectionHeading
          eyebrow="Integrated Platform"
          title="Everything you need in one rental ecosystem"
          subtitle="From finding a room or office to booking cleaning and managing society approvals, REHVO connects every step."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM_SERVICES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col justify-between rounded-2xl border border-rehvo-border bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-rehvo-border-focus hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rehvo-orange"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rehvo-navy text-rehvo-orange transition-colors group-hover:bg-rehvo-orange group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-rehvo-surface-muted px-2.5 py-0.5 text-[11px] font-bold text-rehvo-secondary">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-rehvo-navy transition-colors group-hover:text-rehvo-orange-hover">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-rehvo-secondary">{item.desc}</p>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-rehvo-navy transition-colors group-hover:text-rehvo-orange-hover">
                  <span>Explore</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
