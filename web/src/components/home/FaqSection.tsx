'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does REHVO work?',
      a: 'REHVO is a direct marketplace where verified property owners and flatmates list residential apartments, commercial spaces, and rooms across Mumbai. Renters can search, save properties, chat directly with owners in-app, and schedule physical property visits with verified marketplace fees.',
    },
    {
      q: 'Is REHVO really 100% verified marketplace?',
      a: 'Yes. REHVO connects you with verified property owners and trusted middlemen. All listings are verified with transparent pricing and no hidden fees.',
    },
    {
      q: 'Can I list my property on REHVO?',
      a: 'Absolutely. Property owners can list residential flats, independent rooms, PGs, corporate offices, shops, showrooms, and commercial buildings for free. You get verified tenant enquiries and direct chat management.',
    },
    {
      q: 'How does flatmate matching work on REHVO?',
      a: 'You can browse verified social flatmate profiles filtered by locality, budget, and lifestyle preferences (e.g. non-smoker, vegetarian, pet-friendly). You can also create your own flatmate seeker profile for free.',
    },
    {
      q: 'Can I chat directly with owners without sharing my phone number?',
      a: 'Yes. REHVO features an integrated real-time chat workspace where you can message verified property owners and flatmates securely without publicly revealing your phone number or email address.',
    },
    {
      q: 'How do I schedule a physical property visit?',
      a: 'Every property listing has a "Schedule Visit" option. Simply choose your preferred date and time slot, and the property owner will receive your appointment request to confirm the inspection.',
    },
    {
      q: 'Does REHVO support commercial properties in Mumbai?',
      a: 'Yes! REHVO has a dedicated Commercial marketplace supporting corporate offices, retail shops, showrooms, warehouses, and coworking spaces across major business hubs like BKC, Lower Parel, Andheri East, and Nariman Point.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200/80">
      <div className="max-w-[880px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#0F766E] bg-[#CCFBF1] px-3 py-1 rounded-full border border-[#99F6E4]/60 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#0F766E]" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Got Questions? We&apos;ve Got Answers.
          </h2>
          <p className="text-sm font-medium text-stone-500 mt-1.5">
            Everything you need to know about renting and listing with REHVO.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-stone-200/80 bg-[#F8FAFC] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-stone-900 hover:text-[#0F766E] transition"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#0F766E]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm font-medium text-stone-600 leading-relaxed animate-in fade-in duration-200 border-t border-stone-200/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
