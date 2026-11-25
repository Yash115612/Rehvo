import React from 'react';
import Link from 'next/link';
import { Users, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { FlatmatesIllustration } from '@/components/illustrations/RehvoIllustrations';

const SAMPLE_FLATMATES = [
  {
    name: 'Ananya S.',
    profession: 'Product Designer',
    locality: 'Bandra West',
    budget: '₹28,000/mo',
    tags: ['Non-Smoker', 'Pet Friendly', 'Hybrid Work'],
    initial: 'A',
    bg: 'bg-orange-100 text-orange-800',
  },
  {
    name: 'Rohan M.',
    profession: 'Software Engineer',
    locality: 'Powai (Near Hiranandani)',
    budget: '₹22,000/mo',
    tags: ['Early Riser', 'Fitness', 'Vegetarian'],
    initial: 'R',
    bg: 'bg-sky-100 text-sky-800',
  },
  {
    name: 'Tanvi K.',
    profession: 'Marketing Lead',
    locality: 'Andheri West',
    budget: '₹25,000/mo',
    tags: ['Organized', 'Social', 'Weekend Explorer'],
    initial: 'T',
    bg: 'bg-emerald-100 text-emerald-800',
  },
];

export function AppFlatmateSection() {
  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Context & App Illustration */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-[#F97316]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Lifestyle Matching</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-4xl font-black tracking-tight text-[#001741]">
              Find compatible flatmates. Without awkward surprises.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Match with working professionals based on shared habits, dietary preferences, sleep schedules, and verified background profiles across Mumbai.
            </p>

            {/* Illustration Display Card */}
            <div className="mt-6 flex items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 w-full">
              <div className="shrink-0">
                <FlatmatesIllustration size={80} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#001741]">Direct Flatmate Chat</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Connect without sharing phone numbers until you both feel comfortable.
                </p>
                <Link
                  href="/flatmates"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#F97316] hover:underline"
                >
                  <span>Explore flatmates</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/flatmates"
                className="inline-flex items-center gap-2 rounded-xl bg-[#001741] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0B1F3A] shadow-md"
              >
                <Users className="h-4 w-4 text-[#F97316]" />
                <span>Search Flatmates</span>
              </Link>
              <Link
                href="/flatmates/create"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <span>Create Profile</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Sample Matching Profile Cards */}
          <div className="lg:col-span-7 flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Profiles in Mumbai
              </span>
              <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                100% Verified
              </span>
            </div>

            {SAMPLE_FLATMATES.map((person) => (
              <div
                key={person.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-black ${person.bg}`}>
                    {person.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#001741]">{person.name}</h3>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-600">{person.profession}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Looking in <strong className="font-semibold text-slate-700">{person.locality}</strong>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {person.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <p className="text-xs font-extrabold text-[#001741]">
                    {person.budget}
                  </p>
                  <Link
                    href="/flatmates"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#F97316] hover:underline"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
