import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateAuthorSchema, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { BLOG_POSTS } from '@/lib/seo/blogData';
import { MARKET_REPORTS } from '@/lib/seo/marketReportsData';

export const revalidate = 3600;

interface AuthorPageProps {
  params: { slug: string };
}

const AUTHORS_DATA: Record<
  string,
  {
    slug: string;
    name: string;
    role: string;
    avatar: string;
    bio: string;
    credentials: string[];
    reviewMethodology: string[];
    stats: { label: string; value: string }[];
  }
> = {
  'rehvo-editorial': {
    slug: 'rehvo-editorial',
    name: 'REHVO Editorial & Real Estate Intelligence Desk',
    role: 'Market Research, Deed Verification & Tenant Advocacy Team',
    avatar: '/logo.png',
    bio: 'The REHVO Editorial Desk is an independent research collective of urban housing analysts, MahaRERA legal advisors, and field verification researchers. Based in Mumbai, the desk publishes quarterly rental yields, neighborhood pricing indexes, and consumer protection guides designed to empower renters with transparent, broker-free transaction data.',
    credentials: [
      '15+ Years Combined Mumbai Real Estate Market Research Experience',
      'Automated Maharashtra Index-II Land Registry & Title Deed Verification Specialists',
      'Authors of the Bi-Annual Mumbai Suburban Rental Yield Index',
      'Strict Zero-Brokerage Consumer Protection & Anti-Fraud Policy',
    ],
    reviewMethodology: [
      'Every rental pricing benchmark is validated against registered government Index-II tenancy documents and active physical listings.',
      'Transit times, metro connectivity, and infrastructure milestones are verified via MMRDA, Maha-Metro, and Mumbai Municipal Corporation updates.',
      'No sponsored broker promotions: All property reviews and locality evaluations are independently compiled without commercial bias.',
    ],
    stats: [
      { label: 'Verified Listings Audited', value: '25,000+' },
      { label: 'Mumbai Localities Covered', value: '29+' },
      { label: 'Published Reports & Guides', value: '50+' },
      { label: 'Broker Fees Saved for Renters', value: '₹12 Cr+' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(AUTHORS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = AUTHORS_DATA[params.slug.toLowerCase()];
  if (!author) {
    return { title: 'Author Profile | REHVO' };
  }

  return constructSeoMetadata({
    title: `${author.name} | Real Estate Market Authority`,
    description: author.bio,
    canonicalUrl: `https://rehvo.in/authors/${author.slug}`,
    keywords: [
      author.name.toLowerCase(),
      'rehvo editorial',
      'mumbai real estate researcher',
      'index-ii verification',
      'rental yield analyst',
    ],
  });
}

export default function AuthorProfilePage({ params }: AuthorPageProps) {
  const author = AUTHORS_DATA[params.slug.toLowerCase()];
  if (!author) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Authors', url: '/authors' },
    { name: author.name, url: `/authors/${author.slug}` },
  ];

  const authorSchema = generateAuthorSchema({
    name: author.name,
    role: author.role,
    bio: author.bio,
    url: `https://rehvo.in/authors/${author.slug}`,
    image: `https://rehvo.in${author.avatar}`,
    credentials: author.credentials,
    sameAs: [
      'https://www.instagram.com/rehvo.in',
      'https://linkedin.com/company/rehvo',
      'https://twitter.com/rehvoapp',
    ],
  });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  // Collect articles and market reports
  const publishedArticles = Object.values(BLOG_POSTS).slice(0, 6);
  const publishedReports = Object.values(MARKET_REPORTS).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Author Hero Card */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#031B2A] flex items-center justify-center p-3 border border-slate-200 shrink-0">
              <Image
                src={author.avatar}
                alt={author.name}
                width={80}
                height={80}
                className="w-full h-full object-contain filter brightness-0 invert"
              />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold">
                <ShieldCheck size={14} />
                <span>Verified Google E-E-A-T Research Entity</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
                {author.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                {author.role}
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl pt-2 border-t border-slate-100">
            {author.bio}
          </p>

          {/* Author Performance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {author.stats.map((stat, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                <div className="text-lg sm:text-2xl font-black text-[#031B2A]">{stat.value}</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Editorial Standards & Credentials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credentials */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#0E8F73] font-bold text-xs">
              <Award size={18} />
              <span className="uppercase tracking-wider">Expertise & Professional Credentials</span>
            </div>
            <h2 className="text-lg font-black text-[#031B2A]">
              Domain Experience & Verification Rigor
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              {author.credentials.map((cred, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-[#0E8F73] shrink-0 mt-0.5" />
                  <span>{cred}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Review Methodology */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs">
              <FileCheck size={18} />
              <span className="uppercase tracking-wider">Editorial Integrity & Fact Checking</span>
            </div>
            <h2 className="text-lg font-black text-[#031B2A]">
              Our Research Methodology
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
              {author.reviewMethodology.map((meth, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>{meth}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Published Market Reports */}
      {publishedReports.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
                <TrendingUp size={18} />
                <h2 className="text-base sm:text-lg font-black text-[#031B2A]">
                  Published Real Estate Market Reports
                </h2>
              </div>
              <Link href="/reports" className="text-xs font-bold text-[#0E8F73] hover:underline flex items-center gap-1">
                <span>All reports</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {publishedReports.map((report) => (
                <Link
                  key={report.slug}
                  href={`/reports/${report.slug}`}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0E8F73] hover:shadow-xs transition group block space-y-2"
                >
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 uppercase">
                    Market Intelligence
                  </span>
                  <h3 className="text-sm font-black text-[#031B2A] group-hover:text-[#0E8F73] transition line-clamp-1">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {report.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Published Guides & Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-[#0E8F73] font-bold text-xs">
              <BookOpen size={18} />
              <h2 className="text-base sm:text-lg font-black text-[#031B2A]">
                Published Rental Guides & Tenant Advisory
              </h2>
            </div>
            <Link href="/blog" className="text-xs font-bold text-[#0E8F73] hover:underline flex items-center gap-1">
              <span>All articles</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0E8F73] hover:shadow-xs transition group block space-y-2"
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 uppercase">
                  {article.category}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#031B2A] group-hover:text-[#0E8F73] transition line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {article.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
