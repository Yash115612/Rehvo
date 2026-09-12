'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const COMPATIBILITY_CARDS = [
  {
    name: 'Aanya Sharma',
    role: 'Product Designer at Tech Co',
    budget: '₹22,000 / mo',
    locality: 'Bandra West & Khar',
    matchScore: '98%',
    traits: ['Non-smoker', 'Early Riser', 'Pet Friendly'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rohan Mehta',
    role: 'Consultant at KPMG',
    budget: '₹28,000 / mo',
    locality: 'Powai & Hiranandani',
    matchScore: '95%',
    traits: ['Clean & Quiet', 'Gym Enthusiast', 'Work from Home'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    name: 'Priya Iyer',
    role: 'Finance Analyst at BKC',
    budget: '₹25,000 / mo',
    locality: 'Santacruz & BKC Area',
    matchScore: '94%',
    traits: ['Vegetarian', 'Weekend Explorer', 'Social'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
];

export const FlatmatesBanner: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black tracking-widest text-[#0F766E] uppercase bg-[#CCFBF1] px-3 py-1 rounded-full mb-2">
              <Users className="w-3 h-3 text-[#0F766E]" />
              <span>VIBEMATCH ROOMMATE FINDER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#031B2A] tracking-tight">
              Find Compatible Flatmates
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 font-medium max-w-xl">
              Preview real verified roommate seekers in Mumbai. Filter by lifestyle preferences, work zone, and budget.
            </p>
          </div>

          <Link
            href="/flatmates"
            className="h-11 px-6 rounded-full bg-[#0F766E] hover:bg-[#064E3B] text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition shrink-0"
          >
            <span>Find Flatmates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Compatibility Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMPATIBILITY_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] hover:bg-white rounded-[28px] p-6 border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={card.avatar}
                      alt={card.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="text-sm font-black text-[#031B2A]">{card.name}</h3>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                      </div>
                      <p className="text-[11px] text-[#64748B] font-medium">{card.role}</p>
                    </div>
                  </div>

                  <div className="bg-[#CCFBF1] text-[#064E3B] text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#0F766E]" />
                    <span>{card.matchScore}</span>
                  </div>
                </div>

                <div className="space-y-2 py-3 border-y border-[#E2E8F0] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] font-medium">Budget</span>
                    <span className="font-extrabold text-[#031B2A]">{card.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B] font-medium">Preferred Locality</span>
                    <span className="font-bold text-[#0F766E] truncate max-w-[150px]">{card.locality}</span>
                  </div>
                </div>

                {/* Trait Pills */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {card.traits.map((trait, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded-full border border-[#E2E8F0] text-[#031B2A]"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-3">
                <Link
                  href="/flatmates"
                  className="w-full h-10 rounded-full bg-white hover:bg-[#CCFBF1] text-[#031B2A] hover:text-[#064E3B] border border-[#E2E8F0] hover:border-[#0F766E] text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span>View Compatibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
