import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle, Scale } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Terms of Service | REHVO Mumbai',
  description:
    'Terms of Service governing the use of the REHVO verified rental marketplace, society passes, and digital tenant agreements.',
  canonicalUrl: 'https://rehvo.in/terms',
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#031B2A] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFBF1] bg-[#CCFBF1]/15 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-[#CCFBF1]/20">
            <Scale className="w-3.5 h-3.5 text-[#D4AF37]" />
            Legal Marketplace Agreement
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto">
            Last Updated: September 2026 • REHVO Technologies Private Limited
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-[28px] p-8 sm:p-14 border border-[#E2E8F0] shadow-sm space-y-10 text-xs sm:text-sm text-[#031B2A] leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>Strict Zero Broker Policy:</strong> Commercial brokers, property agents, and unauthorized intermediaries are strictly prohibited from harvesting contacts, posing as property owners, or demanding commissions from REHVO users. Violators face immediate permanent banning and legal prosecution under applicable fraud statutes.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              1. Platform Nature & Services
            </h2>
            <p className="text-[#64748B]">
              REHVO operates as a technology and operations platform facilitating direct peer-to-peer property discovery, physical walkthrough scheduling, and society passes. While REHVO conducts on-site inspections for verified properties, tenants and owners enter into rental leases voluntarily as independent legal parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              2. Owner Representation & Listing Integrity
            </h2>
            <div className="space-y-2 text-[#64748B]">
              <p>Property owners listing on REHVO represent and warrant that:</p>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li>They hold legitimate title, power of attorney, or written authorization from the registered legal owner.</li>
                <li>All listed photos, pricing, deposit amounts, and amenity descriptions reflect current reality.</li>
                <li>They will not charge brokerage, processing fees, or commission of any nature to tenants.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              3. Tenant & Flatmate Conduct
            </h2>
            <p className="text-[#64748B]">
              Users agree to schedule walkthroughs in good faith, respect society by-laws and security personnel when visiting properties using REHVO gate passes, and refrain from abusive communications on our in-app messaging system.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              4. Society Passes & Security Verification
            </h2>
            <p className="text-[#64748B]">
              Digital society visitor passes are issued for the specific date and time slot approved by the homeowner. REHVO is not responsible for access denials arising from emergency society lockdowns, external gate repairs, or false identity presentation by visitors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              5. Governing Law & Jurisdiction
            </h2>
            <p className="text-[#64748B]">
              These terms shall be construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to REHVO services shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-extrabold text-[#031B2A]">
              6. Legal Inquiries
            </h2>
            <p className="text-[#64748B]">
              For formal legal communications, copyright notices, or regulatory inquiries, contact our legal team at{' '}
              <a href="mailto:legal@rehvo.in" className="font-bold text-[#0F766E] hover:underline">
                legal@rehvo.in
              </a>.
            </p>
          </section>
        </div>
      </section>
    </div>
  );
}
