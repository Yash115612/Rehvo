import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Heart, Sparkles, Building, CheckCircle2 } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';

export const metadata: Metadata = constructSeoMetadata({
  title: 'About REHVO | Mumbai Zero-Brokerage Rental & Roommate Platform',
  description:
    'Learn how REHVO is modernizing residential renting in Mumbai by eliminating brokerage fees, verifying property owners, and matching compatible flatmates.',
  canonicalUrl: 'https://rehvo.com/about',
});

export default function AboutPage() {
  const breadcrumbs = [{ name: 'About REHVO', url: '/about' }];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={orgSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-stone-200 shadow-sm mt-4 mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Our Mission & Promise
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Fixing Residential Renting in Mumbai with <span className="text-purple-600">Zero Brokerage</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            REHVO was founded to solve the most painful friction in urban living: paying heavy broker commissions for unverified, duplicate listings. We believe finding a home should be transparent, verified, and direct.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Zero Brokerage Guarantee</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never charge brokerage fees to tenants or property owners. 100% of the rent goes directly to the homeowner, saving renters tens of thousands on every move.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Verified Listings & Profiles</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              We audit listing authenticity, photo veracity, and host identity to ensure genuine homes and eliminate ghost/scam listings entirely from our ecosystem.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Flatmate Compatibility</h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Living with the right roommate changes your entire life. Our flatmate matching empowers working professionals and students to discover like-minded roommates safely.
            </p>
          </div>
        </div>

        <AppDownloadBanner />
      </div>
    </>
  );
}
