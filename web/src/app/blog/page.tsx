import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Sparkles, ArrowRight, Clock, MapPin, Users, Building2 } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Blog & Rental Guides | REHVO Mumbai',
  description:
    'Expert rental guides, neighborhood insights, and verified rental tips for living in Mumbai. Written by the REHVO editorial team.',
  canonicalUrl: 'https://rehvo.in/blog',
});

const ARTICLES = [
  {
    title: 'How Verified Listing Works: Complete Mumbai Tenant & Owner Guide',
    snippet:
      'Eliminate 1 to 2 months of unnecessary hidden fees. How direct peer-to-peer verification and digital rental agreements protect both parties.',
    category: 'Market Insights',
    readTime: '4 min read',
    date: 'Sep 2026',
    icon: Building2,
    href: '/search',
  },
  {
    title: 'Top Mumbai Neighborhoods for Young Professionals: BKC, Bandra & Powai',
    snippet:
      'Comparing commute times, rental yields, lifestyle amenities, and social hubs across western and eastern suburban corridors.',
    category: 'Neighborhoods',
    readTime: '6 min read',
    date: 'Sep 2026',
    icon: MapPin,
    href: '/search?q=Bandra',
  },
  {
    title: 'Flatmate Matching 101: Living Harmoniously in Shared Apartments',
    snippet:
      'Sleep schedules, guest policies, chore splits, and dietary choices. Why compatibility vetting matters before signing a co-living lease.',
    category: 'Flatmates',
    readTime: '5 min read',
    date: 'Sep 2026',
    icon: Users,
    href: '/flatmates',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#031B2A] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFBF1] bg-[#CCFBF1]/15 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-[#CCFBF1]/20">
            <BookOpen className="w-3.5 h-3.5 text-[#34D399]" />
            REHVO Guides & Editorial
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Mumbai Rental Knowledge Base
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto">
            Practical insights on verified rentals, neighborhood living, tenant rights, and flatmate compatibility.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {ARTICLES.map((article, idx) => {
            const Icon = article.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[24px] p-6 border border-[#E2E8F0] shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F766E] bg-[#F0FDFA] px-2.5 py-1 rounded-full border border-[#CCFBF1]">
                      <Icon className="w-3 h-3" />
                      {article.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#031B2A] mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-6">
                    {article.snippet}
                  </p>
                </div>

                <Link
                  href={article.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#064E3B] transition pt-4 border-t border-slate-100"
                >
                  <span>Explore on REHVO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Search CTA Strip */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#064E3B] text-white rounded-[28px] p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to find your next home in Mumbai?
            </h2>
            <p className="text-xs sm:text-sm text-[#CCFBF1]/90">
              Browse 100% verified flats and shared rooms with direct owner contact and verified marketplace.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-white text-[#0F766E] font-bold py-3.5 px-6 rounded-full text-xs hover:bg-[#CCFBF1] transition shadow-sm"
              >
                <span>Browse Rentals</span>
              </Link>
              <Link
                href="/flatmates"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-6 rounded-full text-xs transition border border-white/20"
              >
                <span>Find Flatmates</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
