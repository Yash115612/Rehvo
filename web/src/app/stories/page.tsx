import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { constructSeoMetadata } from '@/lib/seo/metadata';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { REHVO_STORIES } from '@/lib/seo/storiesData';
import { InternalLinksGrid } from '@/components/seo/InternalLinksGrid';

export const metadata: Metadata = constructSeoMetadata({
  title: 'REHVO Web Stories — Visual Mumbai Neighborhood & Rental Guides',
  description:
    'Explore immersive full-screen visual Web Stories on renting apartments, co-living PGs, and lifestyle guides across Mumbai’s top localities.',
  canonicalUrl: 'https://rehvo.in/stories',
});

export default function StoriesIndexPage() {
  const stories = Object.values(REHVO_STORIES);

  return (
    <div className="min-h-screen bg-[#F8FAFB] py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumb items={[{ name: 'Web Stories', url: '/stories' }]} />

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#CCFBF1] text-[#064E3B] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>DISCOVER-READY VISUAL STORIES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#031B2A] tracking-tight">
            Explore Mumbai in Web Stories
          </h1>
          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto font-medium">
            Fast, tappable, visual insights into rents, metro lines, and verified neighborhoods across Mumbai.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0F766E] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[9/14] w-full overflow-hidden bg-slate-900">
                <img
                  src={story.coverImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider">
                    {story.category}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-2 text-white">
                  <h2 className="text-lg sm:text-xl font-black leading-snug">
                    {story.title}
                  </h2>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {story.summary}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-black text-[#5EEAD4]">
                    <span>View Story</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Cross Linking */}
        <div className="pt-8">
          <InternalLinksGrid currentCity="mumbai" />
        </div>
      </div>
    </div>
  );
}
