import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, AlertTriangle, Lock, Eye, Users, PhoneCall, ArrowRight } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Safety Tips & Scam Prevention | REHVO Mumbai',
  description:
    'Best practices for safe rental searching in Mumbai. Learn how REHVO protects you with 100% verified listings, verified listing guarantees, and secure visits.',
  canonicalUrl: 'https://rehvo.in/safety',
});

const SAFETY_TIPS = [
  {
    icon: ShieldCheck,
    title: 'Never Pay Before Physical or Live Inspection',
    desc: 'Never transfer token money, advance rent, or key deposits to anyone before physically visiting the property or completing an authenticated verification via the REHVO app.',
  },
  {
    icon: Lock,
    title: 'Verify Direct Ownership',
    desc: 'REHVO verifies title deeds and society NOCs for listed properties. If someone claiming to represent an owner asks for side payments or commissions, report them immediately.',
  },
  {
    icon: Users,
    title: 'Flatmate & Roommate Verification',
    desc: 'When meeting potential flatmates, always meet in a public cafe or schedule visits during daytime. Confirm employment or college credentials within the REHVO chat ecosystem.',
  },
  {
    icon: AlertTriangle,
    title: 'Beware of Urgent Transfer Requests',
    desc: 'Legitimate owners on REHVO will never pressure you to scan unfamiliar QR codes or send "refundable visit gate pass" fees. Gate pass scams are common on unmoderated classifieds.',
  },
];

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#031B2A] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFBF1] bg-[#CCFBF1]/15 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-[#CCFBF1]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
            Tenant & Owner Protection
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Trust & Safety at REHVO
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto">
            Your safety is our highest priority. Learn how our verified rental marketplace keeps your rental journey secure.
          </p>
        </div>
      </section>

      {/* Safety Rules Grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {SAFETY_TIPS.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#031B2A] mb-2">{tip.title}</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Emergency / Report Banner */}
        <div className="bg-[#031B2A] text-white rounded-[28px] p-8 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black">Notice suspicious activity?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Our safety operations team investigates reported listings and unauthorized commission claims within 2 hours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#14B8A6] text-white font-bold py-3 px-6 rounded-full text-xs transition shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Report to Support</span>
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-5 rounded-full text-xs transition"
            >
              <span>Safety FAQs</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
