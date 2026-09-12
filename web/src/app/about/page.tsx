import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Target,
  Eye,
  CheckCircle2,
  Users,
  Building,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata: Metadata = constructSeoMetadata({
  title: 'About REHVO | Reimagining Rental Living in Mumbai',
  description:
    'Learn how REHVO is modernizing real estate renting in Mumbai by transparent pricing, verifying property owners, and connecting compatible roommates directly.',
  canonicalUrl: 'https://rehvo.in/about',
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: 'About REHVO', url: '/about' }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>THE REHVO STORY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Rent without brokers. <br />
            Live with belonging.
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-xl mx-auto font-medium">
            REHVO was created to end predatory broker commissions, duplicate photos, and middleman chaos in Mumbai real estate.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#E2E8F0] shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[#031B2A]">Our Mission</h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
              To empower every renter, flatmate seeker, and homeowner in India with a 100% commission-free rental marketplace. We believe finding a sanctuary should be based on direct trust, verified facts, and zero friction.
            </p>
          </div>

          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#E2E8F0] shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-[#031B2A]">Our Vision</h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-medium">
              To build the complete residential operating system for India — from natural language AI rental discovery and verified walkthroughs to automated society gate passes and digital rental agreements.
            </p>
          </div>
        </div>

        {/* The 4 Core Pillars */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#E2E8F0] shadow-card mb-16 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A]">The 4 REHVO Pillars</h2>
            <p className="text-xs text-[#64748B]">Built specifically to address the traditional pain points of renting in Mumbai</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2.5">
              <div className="text-2xl font-black text-[#0F766E]">01</div>
              <h3 className="text-base font-black text-[#031B2A]">Verified Marketplace Forever</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Never pay 1 to 2 months of hard-earned salary to an agent for opening a door.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="text-2xl font-black text-[#0F766E]">02</div>
              <h3 className="text-base font-black text-[#031B2A]">Physical Walkthroughs</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Zero ghost or duplicate listings. Every home is physically visited and photographed.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="text-2xl font-black text-[#0F766E]">03</div>
              <h3 className="text-base font-black text-[#031B2A]">Chat with Owner or Broker</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Clarify questions, schedule visits, and confirm details directly with verified landlords.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="text-2xl font-black text-[#0F766E]">04</div>
              <h3 className="text-base font-black text-[#031B2A]">VibeMatch Flatmates</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Discover compatible roommates with shared lifestyles, work schedules, and budgets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
