import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Share2,
  ArrowLeft,
  MapPin,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { BLOG_POSTS } from '@/lib/seo/blogData';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { generateArticleSchema, generateFaqSchema } from '@/lib/seo/schema';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export const revalidate = 3600;

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = BLOG_POSTS[params.slug];
  if (!post) {
    return { title: 'Article Not Found | REHVO' };
  }

  return constructSeoMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    canonicalUrl: `/blog/${post.slug}`,
    imageUrl: post.coverImage,
    type: 'article',
    publishedTime: post.publishDate,
    modifiedTime: post.modifiedDate,
    authors: [post.author.name],
    section: post.category,
    keywords: [
      post.title.toLowerCase(),
      post.category.toLowerCase(),
      'mumbai rentals',
      'tenant guide',
      'rehvo editorial',
    ],
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = BLOG_POSTS[params.slug];
  if (!post) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.metaDescription,
    slug: post.slug,
    publishDate: post.publishDate,
    modifiedDate: post.modifiedDate,
    authorName: post.author.name,
    imageUrl: post.coverImage,
    category: post.category,
  });

  const faqSchema = generateFaqSchema(post.faqs);

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-16">
      {/* Schema.org Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {post.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0E8F73] border border-emerald-200 text-xs font-bold uppercase">
              {post.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="text-xs font-bold text-[#031B2A]">{post.author.name}</div>
                <div className="text-[11px] text-slate-400">{post.author.role}</div>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-400">
              <span>Published: {new Date(post.publishDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] w-full bg-slate-100 rounded-2xl overflow-hidden relative">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed pt-4 border-t border-slate-100">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Related Locality Chips */}
          {post.relatedLocalities.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Related Mumbai Localities:
              </span>
              <div className="flex flex-wrap gap-2">
                {post.relatedLocalities.map((slug) => (
                  <Link
                    key={slug}
                    href={`/mumbai/${slug}`}
                    className="px-3 py-1 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#0E8F73] border border-slate-200 text-xs font-bold text-slate-700 transition"
                  >
                    View flats in {slug.replace('-', ' ')} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAQs */}
        {post.faqs.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-[#0E8F73]" />
              <h2 className="text-lg font-black text-[#031B2A]">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-3 divide-y divide-slate-100">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1">
                  <h3 className="text-xs font-bold text-[#031B2A]">{faq.question}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Internal Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InternalLinksGrid currentCity="mumbai" />
      </div>
    </div>
  );
}
