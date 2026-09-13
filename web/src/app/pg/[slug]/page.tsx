import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Wifi,
  Utensils,
  Lock,
  Sparkles,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { getPublishedProperties } from '@/lib/seo/queries';
import { generatePropertySlug } from '@/lib/seo/slugs';
import { generateItemListSchema, generateFaqSchema } from '@/lib/seo/schema';
import { JsonLd } from '@/components/public/JsonLd';

export const revalidate = 3600;

interface PgIntentProfile {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heading: string;
  subheading: string;
  priceRange: string;
  faqs: { question: string; answer: string }[];
}

const PG_INTENTS: Record<string, PgIntentProfile> = {
  'student-hostels-in-mumbai': {
    slug: 'student-hostels-in-mumbai',
    title: 'Student PGs & Hostels in Mumbai Near Top Colleges',
    metaTitle: 'Student PGs & Hostels in Mumbai Near IIT, NMIMS, Mithibai | REHVO',
    metaDescription: 'Find verified student PGs and hostels in Mumbai near IIT Bombay (Powai), NMIMS (Vile Parle), Mithibai, and HR College. 300 Mbps WiFi, home-cooked meals & biometric security.',
    heading: 'Student PGs & Hostels in Mumbai',
    subheading: 'Verified student accommodations near major Mumbai educational campuses with daily meals, study desks, laundry, and warden support.',
    priceRange: '₹9,500 - ₹22,000/bed',
    faqs: [
      {
        question: 'Which areas have the best student PGs in Mumbai?',
        answer: 'Vile Parle West (NMIMS, Mithibai), Powai (IIT Bombay), Churchgate (HR, KC, Jai Hind), and Andheri West offer high-density student accommodations.',
      },
      {
        question: 'Are meals and WiFi included in student PG rents?',
        answer: 'Yes, most verified student PGs on REHVO include breakfast and dinner, high-speed fiber internet, and daily housekeeping in the monthly fee.',
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PG_INTENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const profile = PG_INTENTS[params.slug];
  if (!profile) return {};

  return constructSeoMetadata({
    title: profile.metaTitle,
    description: profile.metaDescription,
    canonicalUrl: `https://rehvo.in/pg/${params.slug}`,
  });
}

export default async function PgIntentPage({ params }: { params: { slug: string } }) {
  const profile = PG_INTENTS[params.slug];
  if (!profile) notFound();

  const { properties } = await getPublishedProperties({ type: 'pg', limit: 20 });

  const itemListSchema = generateItemListSchema(
    properties,
    `${profile.heading} — REHVO Verified`
  );
  const faqSchema = generateFaqSchema(profile.faqs);

  const breadcrumbItems = [
    { name: 'PG & Hostels', url: '/pg' },
    { name: profile.title, url: `/pg/${profile.slug}` },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <JsonLd data={itemListSchema} />
      <JsonLd data={faqSchema} />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Biometric Security &amp; Wardens</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              <GraduationCap size={14} />
              <span>Campus Proximity</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
            {profile.heading}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            {profile.subheading}
          </p>

          <div className="flex items-center gap-6 pt-2 border-t border-slate-100 text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-[#0E8F73]" /> 3 Meals Daily
            </span>
            <span className="flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-blue-600" /> 300 Mbps Wi-Fi
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-600" /> 24/7 CCTV &amp; Guards
            </span>
          </div>
        </div>
      </header>

      {/* Property Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
              Verified Student Accommodations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Direct contact with verified wardens and managers</p>
          </div>
          <Link
            href="/pg"
            className="text-xs font-bold text-[#0E8F73] hover:underline flex items-center gap-1"
          >
            <span>View all PGs</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {properties.slice(0, 8).map((prop) => {
            const slug = generatePropertySlug(prop);
            const cover = prop.property_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80';
            return (
              <Link
                key={prop.id}
                href={`/property/${slug}`}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-[#0E8F73] transition group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={cover}
                      alt={prop.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/80 text-white backdrop-blur-xs">
                      Verified PG
                    </span>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="text-base font-black text-[#031B2A]">
                      ₹{prop.price.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500">/bed</span>
                    </div>
                    <h3 className="font-bold text-xs text-[#031B2A] line-clamp-1 group-hover:text-[#0E8F73] transition">
                      {prop.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin size={11} className="text-[#0E8F73]" />
                      <span>{prop.locality}, Mumbai</span>
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1 flex items-center justify-between text-[11px] font-bold text-slate-600 border-t border-slate-100">
                  <span>Student Friendly</span>
                  <span className="text-[#0E8F73]">Zero Brokerage</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <h2 className="text-lg sm:text-xl font-black text-[#031B2A]">
            Frequently Asked Questions — Student PGs
          </h2>
          <div className="space-y-4 divide-y divide-slate-100">
            {profile.faqs.map((faq, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-1.5">
                <h3 className="text-sm font-bold text-[#031B2A]">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
