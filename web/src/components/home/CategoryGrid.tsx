import React from 'react';
import Link from 'next/link';
import {
  Home,
  Building,
  Users,
  Briefcase,
  Wrench,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface CategoryItem {
  title: string;
  subtitle: string;
  href: string;
  tag?: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  {
    title: 'Apartments & Flats',
    subtitle: 'Verified 1, 2, 3 BHK homes direct from owners without brokerage.',
    href: '/search?category=residential',
    icon: Home,
  },
  {
    title: 'PG & Co-Living',
    subtitle: 'Furnished private rooms, hostel beds, meal plans and community amenities.',
    href: '/pg',
    icon: Building,
  },
  {
    title: 'Find Flatmates',
    subtitle: 'Discover verified working professionals and shared flats across Mumbai.',
    href: '/flatmates',
    icon: Users,
  },
  {
    title: 'Commercial Spaces',
    subtitle: 'Offices, retail shops, showrooms, warehouses and co-working spaces.',
    href: '/commercial',
    icon: Briefcase,
  },
  {
    title: 'Home Services',
    subtitle: 'Professional deep cleaning, plumbing, electrical, painting and repairs.',
    href: '/services',
    tag: 'Trusted Care',
    icon: Wrench,
  },
  {
    title: 'AI Concierge',
    subtitle: 'Conversational property recommendations tailored to budget and commute.',
    href: '/ai-concierge',
    tag: 'Smart Search',
    icon: Sparkles,
  },
];

export function CategoryGrid() {
  return (
    <section className="py-14 sm:py-20 bg-rehvo-surface-subtle border-b border-rehvo-border-subtle">
      <Container size="wide">
        <SectionHeading
          eyebrow="Marketplace Categories"
          title="Rent what fits your lifestyle"
          subtitle="Explore transparent, zero-brokerage rental solutions across every living and workspace category."
          actionLabel="View All Listings"
          actionHref="/search"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-rehvo-border bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-rehvo-border-focus hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rehvo-orange"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rehvo-orange-soft text-rehvo-orange transition-colors group-hover:bg-rehvo-navy group-hover:text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    {cat.tag && (
                      <span className="rounded-full bg-rehvo-surface-muted px-2.5 py-0.5 text-[11px] font-bold text-rehvo-secondary">
                        {cat.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-rehvo-navy transition-colors group-hover:text-rehvo-orange-hover">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-rehvo-secondary">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-rehvo-navy transition-colors group-hover:text-rehvo-orange-hover">
                  <span>Explore category</span>
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
