import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Calendar, Clock, BarChart3, ShieldCheck } from 'lucide-react';
import { MARKET_REPORTS } from '@/lib/seo/marketReportsData';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

export const metadata: Metadata = {
  title: 'India Rental Market Reports & Yield Index 2026 | REHVO Research',
  description:
    'Authoritative real estate rental market reports, gross yield indices, and micromarket price movements for Mumbai, Pune, Bangalore, and Delhi NCR.',
  alternates: {
    canonical: 'https://rehvo.in/reports',
  },
};

export default function ReportsIndexPage() {
  const reports = Object.values(MARKET_REPORTS);

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ name: 'Research Reports', url: '/reports' }]} className="mb-6" />
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-4">
          <TrendingUp className="w-3.5 h-3.5 text-[#0E8F73]" />
          REHVO Research & Economics
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#031B2A] tracking-tight max-w-3xl">
          Authoritative Rental Market Intelligence & Yield Indices
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl leading-relaxed">
          Deep-dive analysis powered by real registered Index-II lease transactions, metro expansion impact models, and verified owner rental statistics.
        </p>
      </section>

      {/* Reports Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports.map((report) => (
            <article
              key={report.slug}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {report.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {report.publishDate}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {report.readTime}
                    </span>
                  </div>
                </div>

                <Link href={`/reports/${report.slug}`}>
                  <h2 className="text-2xl font-black text-[#031B2A] group-hover:text-[#0E8F73] transition-colors leading-tight mb-3">
                    {report.title}
                  </h2>
                </Link>

                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                  {report.summary}
                </p>

                {/* Metrics preview */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {report.metrics.slice(0, 2).map((m, idx) => (
                    <div key={idx}>
                      <span className="text-xs text-slate-500 font-medium block">{m.label}</span>
                      <span className="text-base font-black text-[#031B2A]">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={report.author.avatar}
                    alt={report.author.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#031B2A]">{report.author.name}</p>
                    <p className="text-[11px] text-slate-400">{report.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/reports/${report.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#0E8F73] group-hover:translate-x-1 transition-transform"
                >
                  Read Full Report
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
