import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Privacy Policy | REHVO Mumbai',
  description:
    'Learn how REHVO protects your personal data under the Digital Personal Data Protection Act (DPDP). Transparent, verified listings, and secure.',
  canonicalUrl: 'https://rehvo.in/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#031B2A] text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-6">
          <Breadcrumb items={[{ name: 'Privacy Policy', url: '/privacy' }]} />
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFBF1] bg-[#CCFBF1]/15 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-[#CCFBF1]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Data Protection & Privacy
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto">
            Effective Date: September 2026 • Compliant with DPDP Act (India)
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-[28px] p-8 sm:p-14 border border-[#E2E8F0] shadow-sm space-y-10 text-xs sm:text-sm text-[#031B2A] leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
            <p className="text-xs text-[#064E3B] leading-relaxed">
              <strong>Zero Spam Commitment:</strong> REHVO never sells, rents, or shares your phone number or email address with brokers, telemarketers, or unverified third parties. Your data is encrypted and used exclusively for your property rental journeys.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              1. Introduction & Scope
            </h2>
            <p className="text-[#64748B]">
              REHVO Technologies Private Limited (&ldquo;REHVO&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) provides a peer-to-peer real estate platform and mobile application connecting homeowners directly with tenants and flatmates without brokers. This Privacy Policy outlines our standards regarding data collection, processing, and retention across https://rehvo.in and REHVO mobile apps.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              2. Information We Collect
            </h2>
            <div className="space-y-2 text-[#64748B]">
              <p>We only collect data necessary to provide a verified marketplace:</p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li><strong>Identity & Account Details:</strong> Name, verified email address, mobile number, and authentication tokens.</li>
                <li><strong>Property Listing Data:</strong> Apartment address, title verification documentation, geo-location, unit photos, and rental terms.</li>
                <li><strong>Flatmate Profile Attributes:</strong> Lifestyle preferences (work schedule, food preference, pet habits) submitted willingly for VibeMatch scoring.</li>
                <li><strong>Device & Telemetry Data:</strong> IP address, device model, operating system version, and app performance logs.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              3. Purpose of Processing
            </h2>
            <p className="text-[#64748B]">
              Your data is collected and processed for explicit, lawful purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li>Facilitating direct renter-to-owner chat and scheduled physical walkthroughs.</li>
              <li>Generating digital society visitor passes for gated community security.</li>
              <li>Assisting with legal tenant verification and e-stamped digital rental agreements.</li>
              <li>Preventing fraudulent broker solicitations and verifying homeowner authenticity.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              4. Data Security & Storage
            </h2>
            <p className="text-[#64748B]">
              All data transmitted to and from REHVO services is encrypted using TLS 1.3 encryption protocols. Databases are hosted in secure, tier-4 ISO/IEC 27001 certified data center facilities located within the Republic of India in full compliance with local data localization mandates.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              5. Your Rights & Data Deletion
            </h2>
            <p className="text-[#64748B]">
              Under applicable Indian privacy laws, you hold the right to access, rectify, or demand full erasure of your personal profile and submitted listings. To request complete data purge, email our Data Protection Officer at{' '}
              <a href="mailto:privacy@rehvo.in" className="font-bold text-[#0F766E] hover:underline">
                privacy@rehvo.in
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              6. Grievance Officer
            </h2>
            <p className="text-[#64748B]">
              In accordance with the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023, the contact details of our Grievance Officer are:
            </p>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-700 space-y-1 text-xs">
              <p><strong>Grievance Officer:</strong> Legal & Compliance Team</p>
              <p><strong>Email:</strong> privacy@rehvo.in</p>
              <p><strong>Address:</strong> Level 8, Platina Tower, Bandra Kurla Complex (BKC), Mumbai 400051</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
