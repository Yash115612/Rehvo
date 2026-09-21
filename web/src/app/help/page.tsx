'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  MessageCircle,
  CalendarCheck,
  Users,
  Home,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Phone,
} from 'lucide-react';
import { Breadcrumb } from '@/components/public/Breadcrumb';

const HELP_CATEGORIES = [
  {
    id: 'search',
    icon: Search,
    title: 'Finding a Home',
    desc: 'How to search by locality, budget, furnishing type, and metro accessibility with verified marketplace.',
  },
  {
    id: 'chat',
    icon: MessageCircle,
    title: 'Chat with Owner or Agent',
    desc: 'Connect directly with verified homeowners and flatmates securely without middleman interference.',
  },
  {
    id: 'visits',
    icon: CalendarCheck,
    title: 'Scheduling Visits',
    desc: 'Book confirmed physical walkthroughs at convenient time slots with instant confirmation.',
  },
  {
    id: 'flatmates',
    icon: Users,
    title: 'Flatmate Matching',
    desc: 'Discover verified flatmate profiles filtered by lifestyle, budget, dietary choices, and work zone.',
  },
  {
    id: 'owners',
    icon: Home,
    title: 'Listing Property',
    desc: 'How landlords and owners can publish residential or commercial spaces with free physical verification.',
  },
  {
    id: 'agreements',
    icon: FileCheck,
    title: 'Rental Agreements',
    desc: 'Instant digital rental agreement draft generation and verified society passes.',
  },
];

const ALL_FAQS = [
  {
    category: 'search',
    q: 'Is REHVO really 100% verified marketplace?',
    a: 'Yes, absolutely. REHVO connects tenants directly with verified homeowners and flatmates. There are zero agent commissions, hidden convenience fees, or transaction percentages charged on standard listings.',
  },
  {
    category: 'search',
    q: 'How are properties physically verified on REHVO?',
    a: 'Our on-ground operations specialists in Mumbai conduct physical visits to each listed apartment. We verify title deed ownership, exact GPS coordinates, room photos, listed amenities, and maintenance conditions before assigning the verified shield badge.',
  },
  {
    category: 'chat',
    q: 'Can I chat directly with property owners without revealing my phone number?',
    a: 'Yes. REHVO features an encrypted in-app messaging workspace. You can communicate with owners, ask questions regarding building rules, and negotiate terms while maintaining complete personal privacy.',
  },
  {
    category: 'visits',
    q: 'How do visit bookings and society passes work?',
    a: 'When you schedule a visit through REHVO, the owner receives an instant calendar slot request. Once accepted, REHVO automatically generates a digital visitor QR pass that society security guards recognize for instant entry.',
  },
  {
    category: 'flatmates',
    q: 'How does VibeMatch roommate pairing work?',
    a: 'Our VibeMatch algorithm evaluates lifestyle parameters including work hours, cleanliness preferences, dietary choices, pet policies, and social habits to score compatibility before you connect.',
  },
  {
    category: 'owners',
    q: 'Is it free for owners to list property on REHVO?',
    a: 'Yes! Owners can list 100% free of charge. We send a verified agent to capture high-definition photos and certify the property without taking any listing fees.',
  },
  {
    category: 'agreements',
    q: 'Does REHVO assist with digital rental agreements and police verification?',
    a: 'Yes. Through our Society Services module, we generate legally compliant, biometric-e-stamped rental agreements and handle online Mumbai Police tenant intimation forms directly.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return ALL_FAQS.filter((faq) => {
      const matchesCategory = !selectedCategory || faq.category === selectedCategory;
      const matchesQuery =
        !searchQuery ||
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] to-[#031B2A] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-6">
          <Breadcrumb items={[{ name: 'Help & Support', url: '/help' }]} />
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#CCFBF1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFBF1] bg-[#CCFBF1]/15 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-[#CCFBF1]/20">
            <HelpCircle className="w-3.5 h-3.5" />
            REHVO Support & Help Center
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            How can we{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-mint">
              help you?
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
            Search answers on verified marketplace, scheduling physical visits, flatmate compatibility, and owner verification.
          </p>

          {/* Search Input */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords (e.g. commission, verification, security pass)..."
              className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-sm font-medium pl-12 pr-4 py-4 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider bg-[#CCFBF1] px-3 py-1 rounded-full">
            Browse by Topic
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight mt-2">
            Explore Support Topics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {HELP_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`text-left rounded-[24px] p-6 border transition duration-200 ${
                  isSelected
                    ? 'bg-emerald-50 border-[#0F766E] shadow-md ring-2 ring-[#0F766E]'
                    : 'bg-white border-[#E2E8F0] shadow-sm hover:border-[#0F766E]/40 hover:shadow-md'
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#031B2A]">{cat.title}</h3>
                <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{cat.desc}</p>
                <div className="mt-4 text-xs font-bold text-[#0F766E] flex items-center gap-1">
                  <span>{isSelected ? 'Showing FAQs' : 'View answers'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white rounded-[28px] p-8 sm:p-12 border border-[#E2E8F0] shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-2xl font-black text-[#031B2A] tracking-tight">
                Frequently Answered Questions
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                {selectedCategory ? `Filtered by topic: ${selectedCategory}` : 'Showing all general topics'}
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-[#0F766E] underline"
              >
                Reset filter
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-stone-500">No matching questions found for &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="mt-3 text-xs font-bold text-[#0F766E] underline"
              >
                Clear search query
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left gap-4"
                    >
                      <h3 className="text-sm font-bold text-[#031B2A] leading-snug">
                        {faq.q}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-[#0F766E]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed pt-2">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Escalation */}
        <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-[24px] p-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <div>
            <h3 className="text-base font-extrabold text-[#064E3B]">Still need assistance?</h3>
            <p className="text-xs text-stone-600 mt-1">Our Mumbai operations team is active daily from 9:00 AM to 8:00 PM IST.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#064E3B] text-white font-bold px-6 py-3 rounded-full text-xs transition shadow-sm"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
