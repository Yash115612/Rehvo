import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import {
  FlatmatesIllustration,
  RentalPassIllustration,
  HomeServicesIllustration,
  PackersMoversIllustration,
  FurnitureRentalIllustration,
  FindYourNextHomeIllustration,
} from '@/components/illustrations/RehvoIllustrations';
import { cn } from '@/lib/cn';

interface ExploreCard {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge?: {
    text: string;
    style: string;
  };
  Illustration: React.FC<{ size?: number; className?: string }>;
}

const EXPLORE_CARDS: ExploreCard[] = [
  {
    id: 'find_home',
    title: 'Find Your Next Home',
    subtitle: 'Zero Brokerage',
    href: '/search?category=residential',
    badge: {
      text: 'DIRECT',
      style: 'bg-[#0284C7] text-white',
    },
    Illustration: FindYourNextHomeIllustration,
  },
  {
    id: 'flatmates',
    title: 'Find Flatmates',
    subtitle: 'Verified Profiles',
    href: '/flatmates',
    badge: {
      text: 'NEW',
      style: 'bg-[#F97316] text-white',
    },
    Illustration: FlatmatesIllustration,
  },
  {
    id: 'rental_pass',
    title: 'Rental Pass & Deposit',
    subtitle: 'Zero Deposit Security',
    href: '/safety',
    badge: {
      text: 'POPULAR',
      style: 'bg-[#D97706] text-white',
    },
    Illustration: RentalPassIllustration,
  },
  {
    id: 'home_services',
    title: 'Home Services',
    subtitle: 'Cleaning & Repairs',
    href: '/services',
    badge: {
      text: 'NEW',
      style: 'bg-[#F97316] text-white',
    },
    Illustration: HomeServicesIllustration,
  },
  {
    id: 'packers_movers',
    title: 'Packers & Movers',
    subtitle: 'Doorstep Shifting',
    href: '/services',
    badge: {
      text: 'TRUSTED',
      style: 'bg-[#0F766E] text-white',
    },
    Illustration: PackersMoversIllustration,
  },
  {
    id: 'furniture_rental',
    title: 'Commercial & PGs',
    subtitle: 'Offices & Co-Living',
    href: '/commercial',
    badge: {
      text: 'DISCOVER',
      style: 'bg-[#7C3AED] text-white',
    },
    Illustration: FurnitureRentalIllustration,
  },
];

export function AppExploreGrid() {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-200">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F97316]">
              REHVO Marketplace Ecosystem
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#001741]">
              Explore Services &amp; Discovery
            </h2>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#001741] hover:text-[#F97316] transition-colors"
          >
            <span>Browse All Categories</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* 6-Card Grid (Exact Mobile App Asymmetric/Pastel DNA) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {EXPLORE_CARDS.map((card) => {
            const Illustration = card.Illustration;
            return (
              <Link
                key={card.id}
                href={card.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  {card.badge ? (
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider',
                        card.badge.style
                      )}
                    >
                      {card.badge.text}
                    </span>
                  ) : <span />}
                </div>

                {/* Illustration Stage */}
                <div className="my-3 flex items-center justify-center h-14">
                  <Illustration size={64} className="transition-transform group-hover:scale-105 duration-200" />
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#001741] leading-snug group-hover:text-[#F97316] transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                    {card.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
