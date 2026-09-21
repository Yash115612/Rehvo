import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Sparkles, ArrowRight, Clock, MapPin, Users, Building2, ShieldCheck } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';
import { BLOG_POSTS } from '@/lib/seo/blogData';

export const metadata: Metadata = constructSeoMetadata({
  title: 'Real Estate Blog & Mumbai Rental Guides',
  description:
    'Expert rental guides, Mumbai locality comparisons, flatmate advice, and tenant legal rights written by REHVO’s research team. Zero Commission tips and rental yield intelligence.',
  canonicalUrl: 'https://rehvo.in/blog',
  keywords: [
    'mumbai rental blog',
    'real estate guides mumbai',
    'tenant rights india',
    'flatmate tips',
    'andheri west vs bandra',
    'rehvo blog',
  ],
});

export default function BlogPage() {
  const posts = Object.values(BLOG_POSTS);
  const breadcrumbs = [{ name: 'Blog & Editorial', url: '/blog' }];

  const CATEGORIES = [
    'All Guides',
    'Rental Tips',
    'Mumbai Locality Guides',
    'Flatmate Tips',
    'PG Guides',
    'Legal & Leases',
    'AI Property Search',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      {/* Top Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Header Banner */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E8F73] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            REHVO Research & Editorial Desk
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
            Mumbai Rental Knowledge & Locality Guides
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Data-backed analysis of Mumbai rental price trends, neighborhood comparisons, legal tenant rights, and flatmate compatibility frameworks.
          </p>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORIES.map((cat, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                  idx === 0
                    ? 'bg-[#0E8F73] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Article Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:border-[#0E8F73] hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/9] w-full bg-slate-100 relative overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/80 text-white backdrop-blur-xs z-10">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{new Date(post.publishDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                  </div>

                  <h2 className="text-base font-extrabold text-[#031B2A] group-hover:text-[#0E8F73] transition line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-3">
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-700">{post.author.name}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-[#0E8F73] flex items-center gap-1 group-hover:translate-x-0.5 transition"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Internal Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
