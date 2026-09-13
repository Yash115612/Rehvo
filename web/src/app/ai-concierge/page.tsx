import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  Bot,
  MessageSquare,
  Search,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  Compass,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AIConciergeInteractiveClient } from '@/components/ai/AIConciergeInteractiveClient';

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO AI Concierge | Intelligent Rental Discovery',
  description:
    'Experience intelligent real estate search with natural language queries, commute calculations, and automated negotiation assistance on REHVO AI.',
  canonicalUrl: 'https://rehvo.in/ai-concierge',
});

const CONVERSATION_EXAMPLES = [
  {
    query: 'Find a quiet 2 BHK in Bandra West under ₹55k with a metro station within 10 mins walk.',
    aiResponse:
      'Found 6 verified homes matching your criteria! Top pick: Sea-facing 2 BHK on Pali Hill with zero deposit, physical walkthrough verified, and 8 mins to Bandra Metro.',
    matchPills: ['98% Match', '8 Mins to Metro', 'Verified Marketplace'],
  },
  {
    query: 'Need a pet-friendly flatmate near Powai Hiranandani. Budget is ₹25,000/mo.',
    aiResponse:
      'Matched with 3 verified flatmate seekers in Powai! Top recommendation: Rohan (Senior Dev at TCS), non-smoker, dog lover, immediate move-in.',
    matchPills: ['96% VibeMatch', 'Pet Friendly', 'Immediate Move-in'],
  },
  {
    query: 'Is ₹48,000 a fair rent price for a 2 BHK in Andheri West near Lokhandwala?',
    aiResponse:
      'Based on the last 30 verified leases in Lokhandwala, the average price for a similar 2 BHK is ₹45,500. REHVO AI suggests offering ₹45,000 with a 12-month lock-in.',
    matchPills: ['Market Index', 'Save ₹3,000/mo', 'AI Negotiation'],
  },
];

export default function AIConciergePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: 'AI Concierge', url: '/ai-concierge' }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-8 sm:my-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] border border-[#0F766E]/20 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider max-w-full truncate">
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#0F766E] shrink-0" />
            <span className="truncate">AI CONCIERGE & DECISION ENGINE</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-[#031B2A] tracking-tight leading-tight">
            The intelligent way to find <br />
            your next home.
          </h1>

          <p className="text-xs sm:text-base text-[#64748B] max-w-2xl mx-auto font-medium leading-relaxed">
            Forget dozens of complicated filters. Talk to REHVO AI just like you would with a personal real estate advisor.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href="/download"
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition"
            >
              <span>Try REHVO AI in App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/search"
              className="h-11 sm:h-12 px-6 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-bold text-[#031B2A] flex items-center justify-center gap-2 transition"
            >
              <span>Browse Manually</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Bilingual AI Concierge */}
        <AIConciergeInteractiveClient />

        {/* Conversation Preview Deck */}
        <div className="my-10 sm:my-16 space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-1 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-[#031B2A]">See How REHVO AI Works</h2>
            <p className="text-xs text-[#64748B]">Real examples of renter queries and AI decision responses</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {CONVERSATION_EXAMPLES.map((conv, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[22px] sm:rounded-[28px] p-4.5 xs:p-6 sm:p-8 border border-[#E2E8F0] shadow-card space-y-3.5 sm:space-y-4"
              >
                {/* User Prompt */}
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#F1F5F9] text-[#031B2A] flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0">
                    You
                  </div>
                  <div className="bg-[#F8FAFC] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-[#031B2A] border border-[#E2E8F0] flex-1">
                    &ldquo;{conv.query}&rdquo;
                  </div>
                </div>

                {/* AI Answer */}
                <div className="flex items-start gap-2.5 sm:gap-3 pl-2 xs:pl-4 sm:pl-10">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                  </div>
                  <div className="bg-gradient-to-br from-[#0F766E]/5 to-transparent p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm text-[#031B2A] border border-[#0F766E]/20 flex-1 space-y-2.5 sm:space-y-3">
                    <p className="font-medium leading-relaxed">{conv.aiResponse}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                      {conv.matchPills.map((pill, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F766E]"
                        >
                          ✓ {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 AI Core Capabilities */}
        <div className="my-10 sm:my-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-[22px] sm:rounded-[28px] p-5 sm:p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Commute Calculator</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Calculates peak traffic duration via Western Express Highway, Metro lines, and local trains.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Fair Rent Estimator</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Detects if a landlord has overpriced a listing compared to true historical society transaction records.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Safety & Vibe Index</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Scores neighborhood streetlighting, walkability to supermarkets, gym access, and late-night safety.
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E2E8F0] shadow-card space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#031B2A]">Auto Match Alerts</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Sends proactive instant notifications the second a verified flat in your target building is listed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
