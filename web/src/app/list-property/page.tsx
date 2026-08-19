import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Building2,
  ShieldCheck,
  Zap,
  CalendarCheck,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AppDownloadBanner } from '@/components/public/AppDownloadBanner';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return constructSeoMetadata({
    title: 'List Property for Rent with Zero Brokerage in Mumbai | REHVO',
    description:
      'List your flat, apartment, or room for rent in Mumbai with 100% zero brokerage. Connect directly with verified working professionals and schedule visits on REHVO.',
    canonicalUrl: 'https://rehvo.com/list-property',
  });
}

export default function ListPropertyPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'List Property', url: '/list-property' },
  ];

  const faqs = [
    {
      question: 'Is listing a property on REHVO completely free for owners?',
      answer:
        'Yes. Listing your residential property on REHVO is 100% free with zero brokerage fees or hidden listing commissions.',
    },
    {
      question: 'How do tenant visits work on REHVO?',
      answer:
        'Prospective tenants choose an available date and timeslot. You receive instant push notifications and can confirm, reschedule, or communicate directly via in-app chat.',
    },
    {
      question: 'Are tenant profiles verified before they can book visits?',
      answer:
        'Yes. REHVO requires verified user profiles and phone numbers to ensure safety, respectful communication, and genuine inquiries.',
    },
    {
      question: 'How fast can I find a tenant on REHVO?',
      answer:
        'Most verified listings in high-demand Mumbai localities like Andheri, Bandra, Powai, and Goregaon receive qualified inquiries within 24 to 48 hours.',
    },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFaqSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-purple-950 rounded-3xl p-8 sm:p-14 text-white my-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-md border border-purple-400/30 text-purple-300 text-xs font-bold px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> For Mumbai Homeowners & Hosts
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              List Your Flat with <span className="text-purple-400">Zero Brokerage</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 mt-4 leading-relaxed">
              Reach thousands of verified working professionals and families searching for rental homes across Mumbai. Save on broker fees and manage tenant visits seamlessly.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                href="https://rehvo.com/app"
                target="_blank"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-purple-600/30 transition flex items-center gap-2"
              >
                Post Property on Mobile App
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/mumbai"
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-semibold text-sm px-6 py-3.5 rounded-2xl border border-white/20 transition"
              >
                Explore Active Listings
              </Link>
            </div>
          </div>
        </div>

        {/* Why Owners Choose REHVO */}
        <section className="my-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Why Homeowners Choose REHVO
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              A modern, transparent rental marketplace engineered for quality tenants and hassle-free management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:border-purple-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">100% Zero Brokerage</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Keep your full rental income. Never pay 1 or 2 months of rent to middleman brokers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:border-purple-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Verified Tenants Only</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Connect with corporate employees, IT professionals, and verified families with complete background transparency.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:border-purple-300 transition">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">Smart Visit Scheduling</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Set your visit availability timeslots and let prospective tenants book visits without constant back-and-forth phone calls.
              </p>
            </div>
          </div>
        </section>

        {/* 3 Step Process */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 mb-16">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
              Simple 3-Step Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              How to Publish Your Property in Minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-base">
                1
              </div>
              <h3 className="text-base font-bold text-stone-900">Open Listing Flow</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Switch to Owner Mode in the REHVO app and tap “Post New Property”.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-base">
                2
              </div>
              <h3 className="text-base font-bold text-stone-900">Add Photos & Pricing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Upload clear room photos, set monthly rent, deposit amount, and select furnishing details.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-stone-900 text-white font-extrabold flex items-center justify-center text-base">
                3
              </div>
              <h3 className="text-base font-bold text-stone-900">Go Live & Receive Visits</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your listing instantly appears on both the mobile app and the public web directory for verified renters.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              Frequently Asked Questions for Owners
            </h2>
          </div>

          <div className="space-y-6 divide-y divide-stone-100">
            {faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                <h3 className="text-base font-bold text-stone-900 mb-2">{faq.question}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AppDownloadBanner />
      </div>
    </>
  );
}
