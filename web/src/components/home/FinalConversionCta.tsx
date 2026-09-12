'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

export const FinalConversionCta: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rehvo-glass-card rounded-[28px] sm:rounded-[36px] overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Left Content */}
          <div className="md:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight leading-[1.15]">
              Ready to find <br />
              your next place?
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#64748B] max-w-md leading-relaxed">
              Join REHVO and explore thousands of verified listings across Mumbai with verified marketplace.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/rent"
                className="h-12 px-7 rounded-full rehvo-glass-coral font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Start Your Search</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:col-span-6 relative aspect-[16/10] md:aspect-auto md:h-full min-h-[280px] sm:min-h-[360px] bg-[#F1F5F9]">
            <RehvoImage
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&auto=format&fit=crop&q=80"
              alt="Happy people in a new home"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
