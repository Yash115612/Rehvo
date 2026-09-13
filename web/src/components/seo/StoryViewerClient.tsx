'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, ArrowRight, Share2, Sparkles } from 'lucide-react';
import { WebStory } from '@/lib/seo/storiesData';

interface StoryViewerClientProps {
  story: WebStory;
}

export const StoryViewerClient: React.FC<StoryViewerClientProps> = ({ story }) => {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const total = story.slides.length;
  const currentSlide = story.slides[currentIdx];

  // Auto-advance timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIdx < total - 1) {
        setCurrentIdx((prev) => prev + 1);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIdx, total]);

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      router.push('/stories');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#031B2A] flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Container simulating vertical 9:16 mobile story canvas */}
      <div className="relative w-full h-full sm:h-[90vh] sm:max-w-[420px] sm:rounded-3xl overflow-hidden bg-black flex flex-col justify-between shadow-2xl border border-white/10">
        {/* Background Image with smooth fade */}
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${currentSlide.image})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/60" />
        </div>

        {/* Top Story Header & Segmented Progress Bars */}
        <div className="relative z-20 p-4 space-y-3">
          {/* Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {story.slides.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx < currentIdx ? 'w-full' : idx === currentIdx ? 'w-full animate-[pulse_1s_infinite]' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Story Bar Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0E8F73] animate-ping" />
              <span className="text-xs font-black tracking-wider uppercase">{story.category}</span>
            </div>
            <Link
              href="/stories"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
              aria-label="Close Story"
            >
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tap Left / Right Invisible Navigation Zones */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-0 top-16 bottom-32 w-1/3 z-10 cursor-pointer focus:outline-none"
          aria-label="Previous Slide"
        />
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-0 top-16 bottom-32 w-1/3 z-10 cursor-pointer focus:outline-none"
          aria-label="Next Slide"
        />

        {/* Story Bottom Slide Content */}
        <div className="relative z-20 p-6 space-y-4 text-white">
          {currentSlide.stat && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E8F73] text-white text-xs font-black">
              <Sparkles className="w-3 h-3" />
              <span>{currentSlide.stat}</span>
            </div>
          )}

          <h2 className="text-2xl font-black tracking-tight leading-tight">
            {currentSlide.title}
          </h2>

          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {currentSlide.subtitle}
          </p>

          {currentSlide.ctaText && currentSlide.ctaLink && (
            <div className="pt-2">
              <Link
                href={currentSlide.ctaLink}
                className="w-full h-12 rounded-full bg-white text-[#031B2A] hover:bg-[#5EEAD4] text-xs font-black flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
