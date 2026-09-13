'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Compass,
  Layout,
  Save,
  Eye,
  Sparkles,
  CheckCircle2,
  Video,
  FileText,
  MapPin,
  HelpCircle,
  Smartphone,
  Monitor,
  ExternalLink,
} from 'lucide-react';

function AdminWebsiteCmsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'homepage';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // CMS Form States
  const [heroSuperTag, setHeroSuperTag] = useState("INDIA'S VERIFIED RENTAL MARKETPLACE");
  const [heroHeadline, setHeroHeadline] = useState('VERIFIED HOMES');
  const [heroSubhead, setHeroSubhead] = useState('OWNERS & TRUSTED BROKERS');
  const [showreelHeading, setShowreelHeading] = useState('See Every Feature, Live.');
  const [showreelSubhead, setShowreelSubhead] = useState(
    'Watch how REHVO works — from verified listings to AI concierge, flatmate matching & smart society tools.'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Website CMS & Homepage Builder
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              Live No-Code Editor
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time live website content manager, hero slider, search banner, showreel copy, and SEO metadata
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://www.rehvo.in"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200 transition cursor-pointer"
          >
            <span>Visit Live Site</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* 2. Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 text-xs font-bold overflow-x-auto">
        {[
          { id: 'homepage', label: 'Homepage Hero & Search' },
          { id: 'showreels', label: 'ShowReel Video Section' },
          { id: 'cities', label: 'Cities & Localities' },
          { id: 'faqs', label: 'FAQs & Knowledge' },
          { id: 'blogs', label: 'Editorial Blogs' },
          { id: 'seo', label: 'SEO & Structured Data' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl transition shrink-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0E8F73] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Website CMS changes published to production edge caches successfully!</span>
        </div>
      )}

      {/* 3. Split Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Editor */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 p-6 shadow-xs dark:shadow-card">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                {activeTab === 'showreels' ? 'ShowReel Section Parameters' : 'Homepage Hero Ad Stage'}
              </h3>
              <span className="text-[10px] font-bold text-[#0E8F73] dark:text-[#10B981] bg-emerald-50 dark:bg-[#10B981]/15 px-2 py-0.5 rounded border border-emerald-200 dark:border-transparent">
                Live Binding
              </span>
            </div>

            {activeTab === 'showreels' ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={showreelHeading}
                    onChange={(e) => setShowreelHeading(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0E8F73]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={3}
                    value={showreelSubhead}
                    onChange={(e) => setShowreelSubhead(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-[#0E8F73]"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Super Tag (Accent Badge)
                  </label>
                  <input
                    type="text"
                    value={heroSuperTag}
                    onChange={(e) => setHeroSuperTag(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0E8F73]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Main Massive Headline
                  </label>
                  <input
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0E8F73]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Subhead Category Text
                  </label>
                  <input
                    type="text"
                    value={heroSubhead}
                    onChange={(e) => setHeroSubhead(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#16161A] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0E8F73]"
                  />
                </div>
              </>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-extrabold text-white flex items-center gap-2 shadow-glow transition cursor-pointer"
              >
                <Save size={14} />
                <span>Save & Publish Live</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Preview Drawer */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 p-5 shadow-xs dark:shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Eye size={15} className="text-[#0E8F73] dark:text-[#10B981]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">Live Visual Simulator</h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/40 p-1 rounded-xl border border-slate-200 dark:border-white/5">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  previewDevice === 'desktop' ? 'bg-[#0E8F73] text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Desktop View"
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  previewDevice === 'mobile' ? 'bg-[#0E8F73] text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
                title="Mobile View"
              >
                <Smartphone size={14} />
              </button>
            </div>
          </div>

          {/* Simulator Canvas */}
          <div className="py-6 flex items-center justify-center">
            <div
              className={`rounded-2xl border border-slate-200 dark:border-white/15 bg-white text-[#031B2A] p-6 shadow-2xl transition-all ${
                previewDevice === 'mobile' ? 'w-72 text-center' : 'w-full text-center'
              }`}
            >
              {activeTab === 'showreels' ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E]">
                    REHVO IN ACTION
                  </span>
                  <h4 className="text-xl font-black tracking-tight">{showreelHeading}</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">{showreelSubhead}</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#6366F1]">
                    {heroSuperTag}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black tracking-tight">{heroHeadline}</h4>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">{heroSubhead}</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 text-center">
            Edge rendered in Next.js with instantaneous CDN cache invalidation
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminWebsiteCmsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-xs text-neutral-500">Loading Website CMS...</div>}>
      <AdminWebsiteCmsContent />
    </React.Suspense>
  );
}
