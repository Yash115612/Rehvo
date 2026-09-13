import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  QrCode,
  CreditCard,
  ShieldCheck,
  Headphones,
  Bell,
  CalendarDays,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { JsonLd } from '@/components/public/JsonLd';
import { generateOrganizationSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schema';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO Society Services | Smart Society Management for Apartments & RWAs',
  description:
    'Smart gated community management ecosystem for residential societies and RWAs in Mumbai: digital visitor QR passes, maintenance payments, clubhouse booking, and guard intercom.',
  canonicalUrl: 'https://rehvo.in/society-services',
});

const SOCIETY_FAQS = [
  {
    question: 'What is REHVO Society Services?',
    answer:
      'REHVO Society Services is a modern gated community operating system for apartment complexes, residential towers, and RWAs. It includes digital visitor QR passes, zero-surcharge maintenance collections, mobile intercom, clubhouse bookings, and digital notice boards.',
  },
  {
    question: 'Does REHVO require wiring or hardware intercom installation?',
    answer:
      'No. REHVO operates entirely wirelessly. Security guards use a dedicated tablet or guard mobile app, and residents receive audio notifications directly on their smartphones.',
  },
  {
    question: 'How are society maintenance payments collected and accounted for?',
    answer:
      'Residents can pay via UPI, credit/debit cards, or net banking directly through the REHVO app with zero payment gateway friction. Committee treasurers receive automatic reconciliation, defaulter reports, and instant digital GST receipts.',
  },
  {
    question: 'Can residents pre-approve guests and food delivery agents?',
    answer:
      'Yes. Residents can create single-use or recurring dynamic QR passes sent instantly via WhatsApp to guests, cabs (Uber/Ola), and food deliveries (Zomato/Swiggy) for seamless gate entry.',
  },
];

const SOCIETY_FEATURES = [
  {
    icon: QrCode,
    title: 'Digital Visitor Pass (QR visitor entry)',
    desc: 'Residents pre-approve guests, delivery agents, and service staff with dynamic QR entry passes sent instantly via WhatsApp.',
    points: ['Instant WhatsApp QR pass', 'Delivery & cab pre-approvals', 'Real-time entry notifications'],
  },
  {
    icon: CreditCard,
    title: 'Maintenance Payments (UPI/Card receipts)',
    desc: 'Collect monthly society maintenance dues via UPI, cards, or net banking with automated digital receipts and bank reconciliation.',
    points: ['0% surcharge UPI options', 'Automated instant PDF receipts', 'Defaulter reminders & accounting'],
  },
  {
    icon: ClubhouseIcon,
    title: 'Clubhouse & Amenity Booking',
    desc: 'Reserve clubhouses, swimming pool slots, tennis courts, and banquet halls without manual registers or double-bookings.',
    points: ['Slot-based live calendar', 'Automated deposit management', 'Rule-based guest quota tracking'],
  },
  {
    icon: ShieldCheck,
    title: 'Guard Desk & Mobile Intercom',
    desc: 'Direct gate-to-mobile app intercom with verified security staff desk, eliminating costly hardware intercom wiring.',
    points: ['No wire installation needed', 'Guard-to-resident audio calls', 'Emergency panic siren alert'],
  },
  {
    icon: Bell,
    title: 'Digital Notice Board',
    desc: 'Broadcast official committee notices, AGM agendas, emergency water/power cuts, and society guidelines in seconds.',
    points: ['Instant push & WhatsApp alerts', 'Read receipts for committee', 'Archive & document repository'],
  },
  {
    icon: Headphones,
    title: 'Helpdesk & Complaint Management',
    desc: 'Centralized ticketing system for common area maintenance, lift issues, plumbing faults, and RWA resolutions.',
    points: ['Photo & video ticket logging', 'SLA resolution timelines', 'Vendor task assignment'],
  },
];

function ClubhouseIcon(props: React.SVGProps<SVGSVGElement>) {
  return <CalendarDays {...props} />;
}

export default function SocietyServicesPage() {
  const orgSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Society Services', url: '/society-services' },
  ]);
  const faqSchema = generateFAQSchema(SOCIETY_FAQS);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <JsonLd data={orgSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ name: 'Society Services', url: '/society-services' }]} />

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto my-8 sm:my-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider max-w-full truncate">
            <Building2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#0F766E] shrink-0" />
            <span className="truncate">GATED COMMUNITY &amp; RWA OPERATING SYSTEM</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Smart Society Management <br className="hidden sm:inline" />
            for Apartments &amp; RWAs
          </h1>

          <p className="text-xs sm:text-base text-[#64748B] max-w-2xl mx-auto font-medium leading-relaxed">
            REHVO Society replaces outdated gate registers and unorganized WhatsApp groups with an integrated operating system for residents, security guards, and managing committees across Mumbai.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href="/contact?subject=society_demo"
              className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xs transition"
            >
              <span>Book a Free Society Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {SOCIETY_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[22px] sm:rounded-[28px] p-5 sm:p-7 border border-[#E2E8F0] shadow-card hover:shadow-card-hover hover:border-[#0F766E]/30 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-[#031B2A]">{feat.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed font-medium">{feat.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  {feat.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-[11px] text-slate-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Final CTA Banner */}
        <div className="bg-gradient-to-r from-[#0F766E] to-[#064E3B] rounded-[24px] sm:rounded-[32px] p-5 xs:p-6 sm:p-12 text-white shadow-card mb-12 sm:mb-16 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#CCFBF1] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Society Onboarding</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight">
              Ready to modernize your residential society?
            </h2>
            <p className="text-xs sm:text-sm text-[#CCFBF1]/85 max-w-xl font-medium">
              We provide complete on-site guard hardware setup, resident onboarding sessions, and committee administrator training across Mumbai.
            </p>
          </div>

          <Link
            href="/contact?subject=society_demo"
            className="h-11 sm:h-12 px-6 sm:px-8 rounded-full bg-white text-[#064E3B] hover:bg-[#CCFBF1] text-xs sm:text-sm font-black flex items-center justify-center gap-2 shrink-0 transition shadow-md active:scale-95"
          >
            <span>Book a Free Society Demo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Society FAQs */}
        <div className="mb-14 sm:mb-16 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200">
          <h2 className="text-xl sm:text-2xl font-black text-[#031B2A] mb-6">
            Frequently Asked Questions about REHVO Society
          </h2>
          <div className="space-y-4">
            {SOCIETY_FAQS.map((faq, idx) => (
              <details key={idx} className="group border border-slate-200 rounded-2xl p-5 open:bg-slate-50 transition">
                <summary className="font-bold text-slate-800 cursor-pointer list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* SEO Cross-Links Mesh */}
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
