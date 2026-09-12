'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Check,
} from 'lucide-react';

interface FlatmateItem {
  id: string;
  name: string;
  age: number;
  avatar: string;
  occupation: string;
  locality: string;
  budgetRange: string;
  matchScore: number;
  isKycVerified: boolean;
  traits: string[];
}

const SAMPLE_FLATMATES: FlatmateItem[] = [
  {
    id: 'fm-1',
    name: 'Aanya Sharma',
    age: 25,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    occupation: 'Senior Product Designer',
    locality: 'Bandra West, Mumbai',
    budgetRange: '₹22k–₹30k/mo',
    matchScore: 98,
    isKycVerified: true,
    traits: ['🚭 Non-Smoker', '💻 Hybrid WFH', '🐾 Pet Lover'],
  },
  {
    id: 'fm-2',
    name: 'Rohan Mehta',
    age: 27,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    occupation: 'Consultant @ KPMG',
    locality: 'Powai Hiranandani',
    budgetRange: '₹25k–₹35k/mo',
    matchScore: 95,
    isKycVerified: true,
    traits: ['🏃 Gym Enthusiast', '🌱 Pure Veg', 'Quiet Evenings'],
  },
  {
    id: 'fm-3',
    name: 'Priya Iyer',
    age: 24,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    occupation: 'Financial Analyst @ BKC',
    locality: 'Santacruz & BKC',
    budgetRange: '₹20k–₹28k/mo',
    matchScore: 94,
    isKycVerified: true,
    traits: ['☕ Coffee Lover', 'Early Riser', '🚭 Clean Habits'],
  },
  {
    id: 'fm-4',
    name: 'Kabir Verma',
    age: 28,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    occupation: 'Software Engineer @ FinTech',
    locality: 'Andheri West',
    budgetRange: '₹24k–₹32k/mo',
    matchScore: 92,
    isKycVerified: true,
    traits: ['💻 100% Remote', 'Weekend Explorer', 'Non-Smoker'],
  },
];

export const FlatmatesSection: React.FC = () => {
  const [wavedIds, setWavedIds] = useState<string[]>([]);

  const toggleWave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-10 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header (Mirrors V4HomeScreen.tsx Find Your Ideal Flatmate) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
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

          <Link
            href="/flatmates"
            className="text-xs sm:text-sm font-black text-[#0F766E] hover:text-[#064E3B] flex items-center gap-1.5 group transition w-fit"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Seeker Cards Grid (App Visual Language) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SAMPLE_FLATMATES.map((fm) => {
            const hasWaved = wavedIds.includes(fm.id);
            return (
              <div
                key={fm.id}
                className="bg-white rounded-[22px] sm:rounded-[28px] p-4.5 xs:p-5 sm:p-6 border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Avatar & Match Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <img
                        src={fm.avatar}
                        alt={fm.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-2xs"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white" />
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black">
                      <Sparkles className="w-3 h-3 text-[#0F766E]" />
                      <span>{fm.matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Name & Occupation */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-black text-[#031B2A]">
                        {fm.name}
                      </h3>
                      <span className="text-xs text-[#64748B] font-bold">, {fm.age}</span>
                      {fm.isKycVerified && (
                        <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] font-medium truncate">
                      {fm.occupation}
                    </p>
                  </div>

                  {/* Preferred Area & Budget */}
                  <div className="py-3 my-3 border-y border-[#F1F5F9] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] font-medium">Budget</span>
                      <span className="font-extrabold text-[#031B2A]">{fm.budgetRange}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] font-medium">Locality</span>
                      <span className="font-bold text-[#0F766E] truncate max-w-[140px]">{fm.locality}</span>
                    </div>
                  </div>

                  {/* Lifestyle Habit Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {fm.traits.map((trait, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-bold bg-[#F8FAFC] text-[#334155] px-2.5 py-0.5 rounded-full border border-[#E2E8F0]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wave Button */}
                <div className="pt-4 mt-4 border-t border-[#F1F5F9]">
                  <button
                    type="button"
                    onClick={(e) => toggleWave(fm.id, e)}
                    className={`w-full h-10 rounded-full text-xs font-black flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      hasWaved
                        ? 'bg-[#10B981] text-white'
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
                </div>
              </div>
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
