'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Search,
  Home,
  Building2,
  FileText,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterColumn {
  title: string;
  icon: React.ElementType;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Discover',
    icon: Search,
    links: [
      { label: 'Rent a Home', href: '/search' },
      { label: 'PG & Co-Living', href: '/pg' },
      { label: 'Find Flatmates', href: '/flatmates' },
      { label: 'Commercial Spaces', href: '/commercial' },
      { label: 'Home Services', href: '/services' },
      { label: 'AI Concierge', href: '/ai-concierge' },
    ],
  },
  {
    title: 'Property Owners',
    icon: Home,
    links: [
      { label: 'List Property Free', href: '/list-property' },
      { label: 'Society Services', href: '/society-services' },
      { label: 'Damage Protection System', href: '/safety' },
      { label: 'Rental Agreement Guide', href: '/guides' },
      { label: 'Verified Listing Benefits', href: '/safety' },
    ],
  },
  {
    title: 'Trust & Protection',
    icon: Shield,
    links: [
      { label: 'Verified Handover System', href: '/safety' },
      { label: 'Pre-Tenancy Condition Baseline', href: '/safety' },
      { label: 'Deposit Protection Rules', href: '/safety' },
      { label: 'Zero Brokerage Guarantee', href: '/search' },
      { label: 'Dispute Mediation Desk', href: '/safety' },
    ],
  },
  {
    title: 'Company & Resources',
    icon: Building2,
    links: [
      { label: 'About REHVO', href: '/about' },
      { label: 'Rental Guides & Insights', href: '/guides' },
      { label: 'Market Reports', href: '/reports' },
      { label: 'Customer Stories', href: '/stories' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'Help Center', href: '/help' },
    ],
  },
  {
    title: 'Legal',
    icon: FileText,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Deposit & Settlement Terms', href: '/terms' },
      { label: 'Evidence Retention Policy', href: '/privacy' },
    ],
  },
];

const TRUST_PILLARS = [
  {
    title: 'Zero Brokerage',
    desc: 'Connect directly with property owners and tenants without middleman commissions.',
  },
  {
    title: 'Verified Handover',
    desc: 'Dual-party photo and video condition baseline recorded at move-in before key exchange.',
  },
  {
    title: 'Damage Protection',
    desc: 'Pre-existing defects protected from deposit deductions; fair side-by-side move-out comparison.',
  },
  {
    title: 'Digital Transparency',
    desc: 'Scheduled visits, digital lease agreements, and transparent deposit accounting.',
  },
];

export function Footer() {
  return (
    <footer className="relative bg-rehvo-navy text-white">
      {/* Top Banner: Differentiator Strip */}
      <div className="border-b border-white/10 bg-rehvo-navy-secondary">
        <Container size="wide">
          <div className="grid grid-cols-1 gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_PILLARS.map((pillar) => (
              <div key={pillar.title} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-rehvo-orange" aria-hidden="true" />
                  <h3 className="text-sm font-bold tracking-tight text-white">{pillar.title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Main Footer Links */}
      <Container size="wide">
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          {FOOTER_COLUMNS.map((col) => {
            const Icon = col.icon;
            return (
              <div key={col.title} className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
                  <Icon className="h-4 w-4 text-rehvo-orange" aria-hidden="true" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                    {col.title}
                  </h4>
                </div>
                <ul className="flex flex-col gap-2.5" role="list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs font-medium text-slate-300 transition-colors hover:text-rehvo-orange"
                        {...(link.isExternal
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Bar: Brand & Legal */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 sm:flex-row">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link href="/" aria-label="REHVO Home">
              <Image
                src="/rehvo-logo-white.png"
                alt="REHVO"
                width={120}
                height={34}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-400 text-center sm:text-left">
              India&apos;s Zero-Brokerage Rental Marketplace with Verified Handover &amp; Damage Protection.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span>&copy; {new Date().getFullYear()} REHVO Technologies Pvt. Ltd.</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
