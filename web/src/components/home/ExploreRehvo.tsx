'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Home, Building2, BedDouble, Users, Sparkles } from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface CategoryItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string; // CSS hex
  accentBg: string;
  accentText: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'rent',
    badge: 'RESIDENTIAL',
    title: 'Find a Home',
    description: 'Verified flats, apartments, villas and homes with verified owner & broker contact.',
    cta: 'Explore Homes',
    href: '/rent',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
    icon: Home,
    accentColor: '#0F766E',
    accentBg: 'bg-[#CCFBF1]',
    accentText: 'text-[#0F766E]',
  },
  {
    id: 'commercial',
    badge: 'WORKSPACES',
    title: 'Commercial Spaces',
    description: 'Offices, shops, showrooms and workspaces for growing businesses.',
    cta: 'Explore Commercial',
    href: '/commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
    icon: Building2,
    accentColor: '#4263EB',
    accentBg: 'bg-[#EEF2FF]',
    accentText: 'text-[#4263EB]',
  },
  {
    id: 'pg-rooms',
    badge: 'CO-LIVING & STAYS',
    title: 'PG & Rooms',
    description: 'PGs, private rooms and co-living stays for comfortable everyday living.',
    cta: 'Explore PG & Rooms',
    href: '/pg-rooms',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=900&auto=format&fit=crop&q=80',
    icon: BedDouble,
    accentColor: '#D69E2E',
    accentBg: 'bg-[#FEF9C3]',
    accentText: 'text-[#D69E2E]',
  },
  {
    id: 'flatmates',
    badge: 'COMMUNITY',
    title: 'Flatmates',
    description: 'Find people with compatible budgets, locations and lifestyles.',
    cta: 'Explore Flatmates',
    href: '/flatmates',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop&q=80',
    icon: Users,
    accentColor: '#3C8D68',
    accentBg: 'bg-[#EBF5F0]',
    accentText: 'text-[#3C8D68]',
  },
];

export const ExploreRehvo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollStart, setScrollStart] = useState<number>(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Triple categories array for seamless infinite looping
  const displayCategories = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  // Auto-scroll loop using requestAnimationFrame for 60fps smooth marquee
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let lastTimestamp = performance.now();
    const speed = 0.55; // Pixels per frame (~33px/sec at 60fps)

    const step = (now: number) => {
      const delta = now - lastTimestamp;
      lastTimestamp = now;

      if (!isPaused && !isDragging && container) {
        // Adjust step by time delta for frame-rate independence
        const distance = speed * (delta / 16.67);
        container.scrollLeft += distance;

        // Total width of one full set of 4 cards
        const singleSetWidth = container.scrollWidth / 3;

        // Loop seamlessly
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSetWidth;
        }
      }

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, isDragging]);

  // Manual scroll buttons
  const handleScroll = (direction: 'left' | 'right') => {
    setIsPaused(true);
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 380;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  // Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollStart(containerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollStart - walk;
  }, [isDragging, scrollStart, startX]);

  const handleMouseUpOrLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 1500);
    }
  }, [isDragging]);

  // Touch Events for Mobile
  const handleTouchStart = () => {
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1500);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-hidden select-none">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPLORE REHVO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight">
              Find the right experience for you.
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#64748B] mt-2 max-w-xl">
              Homes, commercial spaces, stays and people brought together under one trusted marketplace.
            </p>
          </div>

          {/* Desktop Manual Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous Category"
              className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#031B2A] flex items-center justify-center transition shadow-2xs active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next Category"
              className="w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#031B2A] flex items-center justify-center transition shadow-2xs active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Sliding Infinite Carousel Track */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          handleMouseUpOrLeave();
          setIsPaused(false);
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-4 sm:px-6 cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: isDragging ? 'auto' : 'auto' }}
      >
        {displayCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div
              key={`${cat.id}-${idx}`}
              className="w-[290px] sm:w-[360px] lg:w-[380px] shrink-0"
            >
              <Link
                href={cat.href}
                className="group bg-[#FFFFFF] rounded-[26px] overflow-hidden border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between h-[410px] sm:h-[430px] block"
              >
                {/* Card Top: 58% Height Cover Photo */}
                <div className="relative h-[230px] sm:h-[245px] w-full overflow-hidden bg-[#F1F5F9]">
                  <RehvoImage
                    src={cat.image}
                    alt={cat.title}
                    fill
                    fallbackCategory="property"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 290px, 380px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/40 via-transparent to-transparent pointer-events-none" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider ${cat.accentBg} ${cat.accentText} backdrop-blur-xs shadow-2xs`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.badge}</span>
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Content & CTA */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#031B2A] tracking-tight group-hover:text-[#0F766E] transition-colors line-clamp-1">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] font-medium leading-relaxed mt-1.5 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* Action Link Row */}
                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-black text-[#031B2A] group-hover:text-[#0F766E] transition-colors">
                    <span>{cat.cta}</span>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
                      style={{ backgroundColor: `${cat.accentColor}15`, color: cat.accentColor }}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};
