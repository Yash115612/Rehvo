import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building,
  QrCode,
  CreditCard,
  ShieldCheck,
  Users,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO Society Services | Smart Gated Community Management',
  description:
    'Complete residential society ecosystem: digital visitor QR passes, zero-surcharge maintenance payments, amenity reservations, and guard intercom.',
  canonicalUrl: 'https://rehvo.in/society-services',
});

const SOCIETY_FEATURES = [
  {
    icon: QrCode,
    title: 'Digital Visitor Pass',
    desc: 'Residents pre-approve guests, delivery agents, and maintenance contractors with dynamic QR entry codes sent straight to WhatsApp.',
  },
  {
    icon: CreditCard,
    title: 'Zero-Surcharge Maintenance',
    desc: 'Pay monthly maintenance dues via UPI, Net Banking, or Credit Cards with instant PDF receipts and auto-reconciliation.',
  },
  {
    icon: Building,
    title: 'Club & Amenity Booking',
    desc: 'Reserve clubhouses, swimming pool slots, squash courts, and party lawns without manual logbooks or scheduling conflicts.',
  },
  {
    icon: ShieldCheck,
    title: 'Guard Desk & Security',
    desc: 'Direct audio intercom from society gate to resident mobile phone. Multi-tier verified staff check-in and emergency alarms.',
  },
  {
    icon: Bell,
    title: 'Digital Notice Board',
    desc: 'Official committee announcements, AGM notifications, and emergency water/power updates broadcast instantly to all flat owners.',
  },
  {
    icon: Users,
    title: 'Resident Helpdesk & Tickets',
    desc: 'Lodge complaints for common area repairs, lift maintenance, or water leakages with real-time status tracking.',
  },
];

export default function SocietyServicesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: 'Society Services', url: '/society-services' }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Building className="w-4 h-4 text-[#0F766E]" />
            <span>GATED COMMUNITY ECOSYSTEM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Smarter, safer, and connected <br />
            society living.
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto font-medium leading-relaxed">
            REHVO Society replaces outdated logbooks and chaotic WhatsApp groups with a unified digital dashboard for residents, guards, and managing committees.
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              href="/contact"
              className="h-12 px-8 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center gap-2 shadow-xs transition"
            >
              <span>Schedule Society Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {SOCIETY_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#E2E8F0] shadow-card hover:shadow-card-hover transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[#031B2A]">{feat.title}</h3>
                <p className="text-xs text-[#64748B] leading-relaxed font-medium">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Committee CTA Banner */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#064E3B] rounded-[32px] p-8 sm:p-12 text-white shadow-card mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Are you an RWA or Society Committee Member?
            </h2>
            <p className="text-xs sm:text-sm text-[#CCFBF1]/80 max-w-xl">
              Get 6 months free onboarding for your society in Mumbai. Full hardware setup assistance and security guard training included.
            </p>
          </div>

          <Link
            href="/contact"
            className="h-12 px-8 rounded-full bg-white text-[#064E3B] hover:bg-[#CCFBF1] text-xs font-black flex items-center gap-2 shrink-0 transition"
          >
            <span>Request Free RWA Pilot</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
