'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Heart,
  ArrowRight,
  PlusCircle,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { RehvoImage } from '@/components/ui/RehvoImage';

interface FlatmateItem {
  id: string;
  name: string;
  age: number;
  avatar: string;
  occupation: string;
  locality: string;
  roomPreference: string;
  budgetRange: string;
  budgetNumeric: number;
  matchScore: number;
  isKycVerified: boolean;
  traits: string[];
}

const SAMPLE_FLATMATES: FlatmateItem[] = [
  {
    id: 'fm-1',
    name: 'Aanya Sharma',
    age: 25,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    occupation: 'Senior Product Designer',
    locality: 'Bandra West',
    roomPreference: 'Private Room',
    budgetRange: '₹28,000/mo',
    budgetNumeric: 28000,
    matchScore: 98,
    isKycVerified: true,
    traits: ['🚭 Non-Smoker', '💻 Hybrid WFH', '🐾 Pet Lover'],
  },
  {
    id: 'fm-2',
    name: 'Rohan Mehta',
    age: 27,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    occupation: 'Consultant @ KPMG',
    locality: 'Powai Hiranandani',
    roomPreference: 'Master Bedroom',
    budgetRange: '₹32,000/mo',
    budgetNumeric: 32000,
    matchScore: 95,
    isKycVerified: true,
    traits: ['🏃 Gym Enthusiast', '🌱 Pure Veg', 'Early Riser'],
  },
  {
    id: 'fm-3',
    name: 'Priya Iyer',
    age: 24,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
    occupation: 'Financial Analyst @ BKC',
    locality: 'Santacruz & BKC',
    roomPreference: 'Private Room',
    budgetRange: '₹26,000/mo',
    budgetNumeric: 26000,
    matchScore: 94,
    isKycVerified: true,
    traits: ['☕ Coffee Lover', 'Early Riser', '🚭 Clean Habits'],
  },
  {
    id: 'fm-4',
    name: 'Kabir Verma',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    occupation: 'Software Engineer @ FinTech',
    locality: 'Andheri West',
    roomPreference: 'Any Room',
    budgetRange: '₹25,000/mo',
    budgetNumeric: 25000,
    matchScore: 92,
    isKycVerified: true,
    traits: ['💻 100% Remote', 'Weekend Explorer', 'Non-Smoker'],
  },
  {
    id: 'fm-5',
    name: 'Sneha Kulkarni',
    age: 26,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    occupation: 'Brand Strategist @ Lower Parel',
    locality: 'Worli & Lower Parel',
    roomPreference: 'Private Room',
    budgetRange: '₹35,000/mo',
    budgetNumeric: 35000,
    matchScore: 96,
    isKycVerified: true,
    traits: ['🧘 Yoga & Fitness', 'Clean Freak', 'No Late Parties'],
  },
  {
    id: 'fm-6',
    name: 'Aditya Sen',
    age: 29,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80',
    occupation: 'Investment Associate @ Nomura',
    locality: 'Powai / Kanjurmarg',
    roomPreference: 'Master Bedroom',
    budgetRange: '₹30,000/mo',
    budgetNumeric: 30000,
    matchScore: 93,
    isKycVerified: true,
    traits: ['📊 FinTech Pro', 'Quiet Hours', '🚭 Non-Smoker'],
  },
];

export const FlatmatesSection: React.FC = () => {
  const [wavedIds, setWavedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleWave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-10 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header with Carousel Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black uppercase tracking-wider">
                VIBEMATCH OS
              </span>
              <span className="text-[11px] font-bold text-[#64748B]">ROOMMATE FINDER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#031B2A] tracking-tight">
              Find Your Ideal Flatmate
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
              Match by lifestyle, vibe, diet &amp; work schedule in Mumbai with verified profiles
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Carousel Nav Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#031B2A] transition shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="w-9 h-9 rounded-full bg-white hover:bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#031B2A] transition shadow-2xs cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/flatmates"
              className="text-xs sm:text-sm font-black text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 group transition shrink-0 ml-1"
            >
              <span>View All ({SAMPLE_FLATMATES.length}+)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Horizontal Swipeable Flatmate Carousel Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {SAMPLE_FLATMATES.map((fm) => {
            const hasWaved = wavedIds.includes(fm.id);
            const isSaved = savedIds.includes(fm.id);

            return (
              <article
                key={fm.id}
                className="w-[280px] xs:w-[300px] sm:w-[320px] shrink-0 snap-start group relative bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover border border-[#E2E8F0] hover:border-[#0F766E]/40"
              >
                <div>
                  {/* Top Portrait Frame with Image, Scrim & Badges */}
                  <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-[#F1F5F9] mb-3.5 border border-[#E2E8F0] shadow-2xs">
                    <RehvoImage
                      src={fm.avatar}
                      alt={fm.name}
                      fill
                      fallbackCategory="flatmate"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="320px"
                    />

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#031B2A]/90 via-[#031B2A]/30 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
                      {fm.isKycVerified && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#064E3B] text-[10px] font-black shadow-2xs">
                          <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                          <span>Verified</span>
                        </div>
                      )}
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#CCFBF1]/95 backdrop-blur-md text-[#064E3B] text-[10px] font-black shadow-2xs">
                        <Sparkles className="w-2.5 h-2.5 text-[#0F766E]" />
                        <span>{fm.matchScore}% Match</span>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleSave(fm.id, e)}
                      aria-label={isSaved ? 'Unsave flatmate' : 'Save flatmate'}
                      className="absolute right-2.5 top-2.5 w-7.5 h-7.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center text-[#031B2A] transition active:scale-90 shadow-2xs cursor-pointer"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isSaved ? 'fill-[#EF4444] text-[#EF4444]' : 'text-[#64748B]'
                        }`}
                      />
                    </button>

                    {/* Bottom Info Overlay inside Portrait */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-black tracking-tight drop-shadow-sm truncate">
                          {fm.name}, {fm.age}
                        </h3>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] fill-white shrink-0 drop-shadow-sm" />
                      </div>
                      <p className="text-[11px] font-medium text-white/90 drop-shadow-sm flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3 h-3 text-[#2DD4BF] shrink-0" />
                        <span className="truncate">{fm.locality}, Mumbai</span>
                      </p>
                    </div>
                  </div>

                  {/* Occupation text */}
                  <div className="mb-3">
                    <p className="text-xs font-bold text-[#0F766E] truncate">
                      {fm.occupation}
                    </p>
                  </div>

                  {/* Budget & Room Preference Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                      <span className="block text-[9.5px] font-black text-[#64748B] uppercase tracking-wider">
                        Max Budget
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#031B2A]">
                        {fm.budgetRange}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                      <span className="block text-[9.5px] font-black text-[#64748B] uppercase tracking-wider">
                        Preference
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#031B2A] truncate block">
                        {fm.roomPreference}
                      </span>
                    </div>
                  </div>

                  {/* Lifestyle Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {fm.traits.map((trait, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-bold bg-[#F1F5F9] text-[#334155] px-2 py-0.5 rounded-md border border-[#E2E8F0]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Row: Wave Button & Profile Link */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => toggleWave(fm.id, e)}
                    className={`flex-1 h-10 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      hasWaved
                        ? 'bg-[#10B981] text-white shadow-2xs'
                        : 'bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#0F766E]/30'
                    }`}
                  >
                    {hasWaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>✓ Waved</span>
                      </>
                    ) : (
                      <span>👋 Wave &amp; Say Hi</span>
                    )}
                  </button>

                  <Link
                    href="/flatmates"
                    aria-label={`View profile of ${fm.name}`}
                    className="w-10 h-10 rounded-full bg-[#F8FAFC] hover:bg-[#CCFBF1] border border-[#E2E8F0] hover:border-[#0F766E]/40 flex items-center justify-center text-[#64748B] hover:text-[#0F766E] transition shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Roommate Matchmaker Banner Card (App Mirror) */}
        <div className="bg-gradient-to-r from-[#064E3B] via-[#0F766E] to-[#115E59] rounded-[24px] sm:rounded-[32px] p-5 xs:p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#CCFBF1] text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#2DD4BF]" />
              <span>VERIFIED ROOMMATES</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Looking for a Room or Flatmate in Mumbai?
            </h3>
            <p className="text-xs sm:text-sm text-[#CCFBF1]/80 max-w-xl font-medium">
              Create your verified roommate profile to match based on sleeping schedules, diet, hygiene, and budget compatibility with background-verified community.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/flatmates"
              className="h-11 px-6 rounded-full bg-[#CCFBF1] hover:bg-white text-[#064E3B] text-xs font-black flex items-center justify-center gap-2 shadow-md transition"
            >
              <span>Explore Flatmates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/download"
              className="h-11 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-black border border-white/25 flex items-center justify-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Profile</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
