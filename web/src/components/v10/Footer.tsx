'use client';

import React from 'react';
import Link from 'next/link';
import {
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Star,
  Home,
  Building2,
  Users,
  Search,
} from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Discover',
    icon: Search,
    links: [
      { label: 'Rent a Home', href: '/search' },
      { label: 'PG & Co-Living', href: '/pg' },
      { label: 'Commercial Spaces', href: '/commercial' },
      { label: 'Find Flatmates', href: '/flatmates' },
      { label: 'AI Concierge', href: '/ai-concierge' },
      { label: 'All Services', href: '/services' },
    ],
  },
  {
    title: 'Owners',
    icon: Home,
    links: [
      { label: 'List Property Free', href: '/list-property' },
      { label: 'Host & Earn', href: '/list-property#earn' },
      { label: 'Society Services', href: '/society-services' },
      { label: 'Rental Calculator', href: '/list-property#calc' },
      { label: 'KYC & e-Agreements', href: '/services#kyc' },
      { label: 'Zero Deposit', href: '/services#zero-deposit' },
    ],
  },
  {
    title: 'Top Localities',
    icon: MapPin,
    links: [
      { label: 'Bandra West', href: '/search?locality=bandra-west' },
      { label: 'Andheri West', href: '/search?locality=andheri-west' },
      { label: 'Powai', href: '/search?locality=powai' },
      { label: 'Worli & Lower Parel', href: '/search?locality=worli' },
      { label: 'Juhu & Vile Parle', href: '/search?locality=juhu' },
      { label: 'BKC', href: '/search?locality=bkc' },
    ],
  },
  {
    title: 'Company',
    icon: Building2,
    links: [
      { label: 'About REHVO', href: '/about' },
      { label: 'Instagram (@rehvo.in)', href: 'https://www.instagram.com/rehvo.in?stkn=MW5jZ2x6b2xwbTJrbA==', isExternal: true },
      { label: 'Blog', href: '/blog' },
      { label: 'Market Reports', href: '/reports' },
      { label: 'Stories', href: '/stories' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Safety', href: '/safety' },
      { label: 'Help Center', href: '/help' },
    ],
  },
  {
    title: 'Legal',
    icon: ShieldCheck,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/terms#refund' },
      { label: 'Cookie Policy', href: '/privacy#cookies' },
    ],
  },
];

const STATS = [
  { value: '25,000+', label: 'Verified Homes' },
  { value: '4.9★', label: 'App Rating' },
  { value: '1,20,000+', label: 'Happy Renters' },
  { value: '0%', label: 'Broker Fee' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#031B2A] text-white relative overflow-hidden">

      {/* Subtle background glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0F766E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#064E3B]/20 rounded-full blur-3xl pointer-events-none" />

      {/* ── TOP CTA BAND ─────────────────────────────────────────────── */}
      <div className="relative border-b border-white/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left: Big headline */}
            <div className="text-center lg:text-left space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-[#0F766E]/30 border border-[#0F766E]/50 text-[#2DD4BF] px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Mumbai's #1 Rental App
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Find Your Perfect<br />
                <span className="text-[#2DD4BF]">Home in Mumbai</span>
              </h2>
              <p className="text-sm text-white/60 font-medium">
                Verified homes · 0% brokerage · Move in within 7 days
              </p>
            </div>

            {/* Right: App download + search CTA */}
            <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-[#0F766E] hover:bg-[#10B981] text-white font-black text-sm transition-all shadow-lg shadow-teal-900/40 active:scale-95"
              >
                <Search className="w-4 h-4" />
                Search Homes
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* App Store Badges */}
              <div className="flex items-center gap-3">
                <Link
                  href="/download"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4 text-[#2DD4BF]" />
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] text-white/50 font-semibold uppercase tracking-wider">Download on</div>
                    <div className="text-xs font-black text-white leading-none">App Store</div>
                  </div>
                </Link>
                <Link
                  href="/download"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition group"
                >
                  <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4 text-[#2DD4BF]" />
                  </div>
                  <div className="text-left">
                    <div className="text-[9px] text-white/50 font-semibold uppercase tracking-wider">Get it on</div>
                    <div className="text-xs font-black text-white leading-none">Google Play</div>
                  </div>
                </Link>
              </div>

              {/* Rating badge */}
              <div className="flex items-center gap-2 text-xs text-white/50 font-semibold">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <span>4.9 on App Store & Play Store · 50k+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ─────────────────────────────────────────────────── */}
      <div className="relative border-b border-white/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-black text-[#2DD4BF]">{stat.value}</div>
                <div className="text-[11px] text-white/50 font-semibold mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN LINKS GRID ───────────────────────────────────────────── */}
      <div className="relative">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">

            {/* Brand Column */}
            <div className="lg:col-span-3 space-y-6">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <img
                  src="/rehvo-logo.png"
                  alt="REHVO"
                  width={100}
                  height={32}
                  style={{ maxHeight: '32px', height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }}
                  className="h-8 w-auto object-contain"
                />
              </Link>

              <p className="text-sm text-white/55 leading-relaxed">
                Mumbai's most trusted rental marketplace. Verified homes, zero brokerage, digital agreements — all in one app.
              </p>

              {/* Contact */}
              <div className="space-y-2.5 text-xs text-white/50 font-medium">
                <a href="mailto:support@rehvo.in" className="flex items-center gap-2 hover:text-[#2DD4BF] transition group">
                  <Mail className="w-3.5 h-3.5 text-[#0F766E] group-hover:text-[#2DD4BF] shrink-0" />
                  support@rehvo.in
                </a>
                <a href="tel:+918888888888" className="flex items-center gap-2 hover:text-[#2DD4BF] transition group">
                  <Phone className="w-3.5 h-3.5 text-[#0F766E] group-hover:text-[#2DD4BF] shrink-0" />
                  +91 88888 88888
                </a>
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0 mt-0.5" />
                  <span>BKC, Mumbai — 400051<br />Maharashtra, India</span>
                </p>
              </div>

              {/* Follow REHVO Section */}
              <div className="pt-2 space-y-3">
                <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Follow REHVO</span>
                  <span className="text-[10px] text-[#F97316] font-extrabold bg-[#F97316]/10 px-2 py-0.5 rounded-full border border-[#F97316]/20">
                    Official
                  </span>
                </div>

                {/* Featured Instagram Box */}
                <a
                  href="https://www.instagram.com/rehvo.in?stkn=MW5jZ2x6b2xwbTJrbA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow REHVO on Instagram"
                  title="Follow REHVO on Instagram"
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-[#F97316]/10 border border-white/10 hover:border-[#F97316]/40 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:ring-offset-2 focus:ring-offset-[#031B2A]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF543E] via-[#FF0077] to-[#833AB4] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white group-hover:text-[#F97316] transition-colors flex items-center gap-1">
                        <span>Instagram</span>
                        <span className="text-[9px] text-[#2DD4BF] font-extrabold">● LIVE</span>
                      </div>
                      <div className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors font-semibold">
                        @rehvo.in
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all shrink-0" />
                </a>

                {/* Social Icons Row */}
                <div className="flex items-center gap-2 pt-0.5">
                  <a
                    href="https://www.instagram.com/rehvo.in?stkn=MW5jZ2x6b2xwbTJrbA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow REHVO on Instagram"
                    title="Follow REHVO on Instagram"
                    className="w-9 h-9 rounded-xl bg-white/8 hover:bg-[#F97316] border border-white/10 hover:border-[#F97316] flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/company/rehvo"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow REHVO on LinkedIn"
                    title="Follow REHVO on LinkedIn"
                    className="w-9 h-9 rounded-xl bg-white/8 hover:bg-[#0F766E] border border-white/10 hover:border-[#0F766E] flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com/rehvoapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow REHVO on X (Twitter)"
                    title="Follow REHVO on X (Twitter)"
                    className="w-9 h-9 rounded-xl bg-white/8 hover:bg-[#0F766E] border border-white/10 hover:border-[#0F766E] flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Link Columns */}
            <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6">
              {FOOTER_LINKS.map((col) => (
                <div key={col.title} className="space-y-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                    <col.icon className="w-3 h-3 text-[#0F766E]" />
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        {(link as any).isExternal ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit ${link.label}`}
                            title={`Visit ${link.label}`}
                            className="text-[13px] text-white/50 hover:text-[#F97316] font-medium transition-colors duration-150 block leading-snug"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-[13px] text-white/50 hover:text-[#2DD4BF] font-medium transition-colors duration-150 block leading-snug"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────────── */}
      <div className="relative border-t border-white/8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

            <p className="text-[11px] text-white/35 font-medium">
              © 2026 REHVO Technologies Pvt. Ltd. All rights reserved.
            </p>

            {/* Trust badges */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/35 px-2.5 py-1 rounded-full border border-white/10">
                <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
                SSL Secured
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white/35 px-2.5 py-1 rounded-full border border-white/10">
                <Users className="w-3 h-3 text-[#0F766E]" />
                MahaRERA Compliant
              </span>
              <span className="text-[10px] text-white/25 font-medium flex items-center gap-1">
                Crafted with <span className="text-[#34D399] text-xs">♥</span> in Mumbai
              </span>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};
