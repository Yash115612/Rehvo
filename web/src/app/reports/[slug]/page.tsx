import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  Share2,
  CheckCircle2,
  MapPin,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { MARKET_REPORTS } from '@/lib/seo/marketReportsData';
import { LOCALITIES_DATA } from '@/lib/seo/localityData';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return Object.keys(MARKET_REPORTS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const report = MARKET_REPORTS[params.slug];
  if (!report) return { title: 'Market Report Not Found' };

  const canonical = `https://rehvo.in/reports/${report.slug}`;

  return {
    title: `${report.title} | REHVO Market Intelligence`,
    description: report.summary,
    alternates: {
      canonical,
    },
    openGraph: {
      title: report.title,
      description: report.summary,
      url: canonical,
      type: 'article',
      publishedTime: report.publishDate,
      authors: [report.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: report.title,
      description: report.summary,
    },
  };
}

export default function ReportDetailPage({ params }: Props) {
  const report = MARKET_REPORTS[params.slug];
  if (!report) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: report.title,
    description: report.summary,
    datePublished: report.publishDate,
    dateModified: report.publishDate,
    author: {
      '@type': 'Person',
      name: report.author.name,
      jobTitle: report.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'REHVO Technologies',
      logo: {
        '@type': 'ImageObject',
        url: 'https://rehvo.in/rehvo-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rehvo.in/reports/${report.slug}`,
    },
  };

  const breadcrumbs = [
    { name: 'Research Reports', url: '/reports' },
    { name: report.title, url: `/reports/${report.slug}` },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Top Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Breadcrumbs items={breadcrumbs} className="mb-3" />
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0E8F73] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all research reports
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-100">
              {report.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {report.publishDate}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {report.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight mt-4 mb-4 leading-tight">
            {report.title}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            {report.subtitle}
          </p>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={report.author.avatar}
                alt={report.author.name}
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="text-sm font-bold text-[#031B2A]">{report.author.name}</p>
                <p className="text-xs text-slate-500">{report.author.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {report.metrics.map((m, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm"
            >
              <span className="text-xs text-slate-500 font-semibold block mb-1">{m.label}</span>
              <span className="text-2xl font-black text-[#031B2A] tracking-tight block">
                {m.value}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {m.change}
              </span>
            </div>
          ))}
        </div>

        {/* Executive Summary */}
        <div className="bg-emerald-950 text-white p-8 rounded-3xl mb-12 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
            Executive Summary
          </h2>
          <p className="text-base text-emerald-100 leading-relaxed">
            {report.summary}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 mb-12">
          {report.contentSections.map((sec, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl font-black text-[#031B2A] tracking-tight">
                {sec.heading}
              </h2>
              <p className="text-base text-slate-700 leading-relaxed">
                {sec.body}
              </p>
              {sec.highlightBox && (
                <div className="p-5 bg-amber-50/80 border-l-4 border-amber-500 rounded-r-2xl text-amber-950 text-sm font-semibold leading-relaxed">
                  {sec.highlightBox}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Data Table */}
        {report.tableData && (
          <div className="mb-12">
            <h3 className="text-xl font-black text-[#031B2A] mb-4">
              Micromarket Rental Benchmark Matrix
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-600">
                  <tr>
                    {report.tableData.headers.map((h, i) => (
                      <th key={i} className="px-5 py-3.5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {report.tableData.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-5 py-4 whitespace-nowrap">
                          {cIdx === 0 ? <strong>{cell}</strong> : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl mb-12 shadow-sm">
          <h3 className="text-lg font-black text-[#031B2A] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0E8F73]" />
            Key Research Takeaways
          </h3>
          <ul className="space-y-3">
            {report.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="w-2 h-2 rounded-full bg-[#0E8F73] mt-2 shrink-0" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Related Localities */}
        {report.relatedLocalities.length > 0 && (
          <div className="pt-8 border-t border-slate-200">
            <h3 className="text-lg font-black text-[#031B2A] mb-4">
              Explore Verified Properties in These Micromarkets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {report.relatedLocalities.map((locSlug) => {
                const loc = LOCALITIES_DATA[locSlug];
                if (!loc) return null;
                return (
                  <Link
                    key={locSlug}
                    href={`/${loc.citySlug}/${loc.slug}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all group flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-black text-[#031B2A] group-hover:text-[#0E8F73] transition-colors">
                        {loc.name}
                      </h4>
                      <p className="text-xs text-slate-500">Avg 2BHK: ₹{loc.avgRent2BHK.toLocaleString('en-IN')}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0E8F73] transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
