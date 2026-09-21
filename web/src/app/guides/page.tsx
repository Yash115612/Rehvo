import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  ShieldCheck,
  Scale,
  Users,
  Home,
  Building,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateBreadcrumbSchema, generateFaqSchema } from '@/lib/seo/schema';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export const revalidate = 3600;

export const metadata: Metadata = constructSeoMetadata({
  title: 'Mumbai Rental Guides, Legal Advice & Tenant Rights | REHVO',
  description:
    'Authoritative guides on renting in Mumbai, Maharashtra Index-II title verification, MahaRERA tenancy rules, finding flatmates, Zero Commission, and society bye-laws.',
  canonicalUrl: 'https://rehvo.in/guides',
  keywords: [
    'mumbai rental guide',
    'tenant rights mumbai',
    'index-ii verification guide',
    'maharera rental agreement',
    'finding flatmates mumbai',
    'Zero Commission guide',
    'housing society bye laws mumbai',
  ],
});

const GUIDE_CATEGORIES = [
  {
    id: 'legal',
    title: 'Legal & Rental Agreements',
    icon: Scale,
    description: 'Index-II deed verification, MahaRERA rules, stamp duty, and police intimation.',
    guides: [
      {
        title: 'Complete Guide to Maharashtra Index-II Verification',
        summary: 'How to verify government land records and property title deeds before paying rental deposits.',
        href: '/blog/mumbai-rental-agreement-guide',
        readTime: '6 min read',
        tag: 'Legal Verification',
      },
      {
        title: 'MahaRERA Rules for Registered Rent Agreements',
        summary: 'Digital biometric e-registration, notice period statutes, and security deposit legal limits in Mumbai.',
        href: '/blog/security-deposit-laws-mumbai',
        readTime: '8 min read',
        tag: 'MahaRERA',
      },
    ],
  },
  {
    id: 'renting',
    title: 'Renting & Zero Commission',
    icon: Home,
    description: 'Bypassing middlemen, direct homeowner negotiations, and move-in checklists.',
    guides: [
      {
        title: 'How to Rent Direct from Homeowners Without Commission Fees',
        summary: 'Save an entire month rent (₹40,000 to ₹1,50,000) using verified direct landlord platforms.',
        href: '/blog/zero-commission-renting-mumbai',
        readTime: '5 min read',
        tag: 'Zero Commission',
      },
      {
        title: 'Moving to Mumbai: Suburban vs Island City Guide',
        summary: 'Comparing Western Suburbs, Central Mumbai, and South Mumbai rental costs and commute corridors.',
        href: '/blog/western-suburbs-vs-south-mumbai',
        readTime: '7 min read',
        tag: 'Relocation',
      },
    ],
  },
  {
    id: 'flatmates',
    title: 'Flatmates & Co-Living',
    icon: Users,
    description: 'Finding compatible flatmates, splitting utility bills, and shared room etiquette.',
    guides: [
      {
        title: 'Finding Safe Flatmates in Bandra, Andheri & Powai',
        summary: 'Essential lifestyle compatibility filters, background checks, and shared lease considerations.',
        href: '/blog/finding-flatmates-in-mumbai',
        readTime: '5 min read',
        tag: 'Flatmates',
      },
      {
        title: 'Best Areas in Mumbai for Working Professional Flatshares',
        summary: 'Top residential clusters near Metro Line 1, 2A, 7 and corporate business districts.',
        href: '/blog/best-mumbai-localities-for-professionals',
        readTime: '6 min read',
        tag: 'Co-Living',
      },
    ],
  },
  {
    id: 'society',
    title: 'Housing Societies & Bye-Laws',
    icon: Building,
    description: 'Understanding society NOCs, bachelor policies, pet guidelines, and move-in charges.',
    guides: [
      {
        title: 'Tenant Rights in Mumbai Housing Societies',
        summary: 'What housing society managing committees can and cannot mandate for tenants and bachelors.',
        href: '/blog/housing-society-bye-laws-mumbai',
        readTime: '7 min read',
        tag: 'Society Bye-Laws',
      },
      {
        title: 'Pet-Friendly Societies in Mumbai Western Suburbs',
        summary: 'Navigating pet rules, open spaces, and cooperative housing guidelines in Andheri and Bandra.',
        href: '/blog/pet-friendly-apartments-mumbai',
        readTime: '4 min read',
        tag: 'Pet Living',
      },
    ],
  },
];

const GUIDES_FAQS = [
  {
    question: 'Why are REHVO rental guides considered authoritative in Mumbai?',
    answer:
      'All REHVO guides are authored by our Real Estate Intelligence Desk and reviewed by MahaRERA legal consultants, ensuring compliance with Maharashtra Rent Control laws and Index-II title deed verification standards.',
  },
  {
    question: 'How do I avoid paying Commission Fees in Mumbai?',
    answer:
      'Utilize REHVO to access 100% verified direct owner listings where title deeds have already been authenticated, allowing direct landlord communication without agent intermediaries.',
  },
  {
    question: 'What is the standard security deposit legally allowed in Mumbai?',
    answer:
      'While traditional middlemen demand 4 to 8 months deposit, standard market practices recommend 2 to 3 months, and REHVO verified listings often feature Zero-Deposit or 1-month deposit guarantees.',
  },
];

export default function GuidesHubPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Guides & Advice', url: '/guides' },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFaqSchema(GUIDES_FAQS);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Mumbai Rental Guides, Legal Advice & Tenant Rights',
    description:
      'Comprehensive educational library for Mumbai tenants covering lease agreements, Index-II validation, and housing society bye-laws.',
    url: 'https://rehvo.in/guides',
    publisher: {
      '@type': 'Organization',
      name: 'REHVO',
      url: 'https://rehvo.in',
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
            <BookOpen size={14} />
            <span>REHVO Knowledge Base & Editorial Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
            Mumbai Rental Guides & Legal Tenant Advisory
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Everything you need to rent transparently in Mumbai. Unbiased advice on Maharashtra Index-II title verification, MahaRERA lease agreements, security deposits, flatmates, and society bye-laws.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#0E8F73]">
              <ShieldCheck size={16} />
              MahaRERA & Legal Fact-Checked
            </span>
            <span className="text-slate-300">•</span>
            <Link
              href="/authors/rehvo-editorial"
              className="hover:text-[#0E8F73] underline transition"
            >
              Curated by REHVO Editorial Desk
            </Link>
          </div>
        </div>
      </header>

      {/* Categorized Guides Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
        {GUIDE_CATEGORIES.map((cat) => (
          <div key={cat.id} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0E8F73] flex items-center justify-center">
                <cat.icon size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">{cat.title}</h2>
                <p className="text-xs text-slate-500">{cat.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.guides.map((guide, idx) => (
                <Link
                  key={idx}
                  href={guide.href}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0E8F73] hover:shadow-sm transition group block space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {guide.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-[#031B2A] group-hover:text-[#0E8F73] transition line-clamp-1">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {guide.summary}
                  </p>

                  <div className="pt-2 text-xs font-bold text-[#0E8F73] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read complete guide</span>
                    <ArrowRight size={13} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-[#0E8F73]" />
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Frequently Asked Questions About Renting in Mumbai
            </h2>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {GUIDES_FAQS.map((faq, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-1.5">
                <h3 className="text-sm font-bold text-[#031B2A]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
