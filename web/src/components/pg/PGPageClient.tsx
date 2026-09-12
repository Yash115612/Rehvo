'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  ShieldCheck,
  Sparkles,
  BedDouble,
  Utensils,
  Wifi,
  Lock,
  ChevronDown,
  ChevronRight,
  Filter,
  Users,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyCard } from '@/components/v10/PropertyCard';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AppDownloadModal } from '@/components/public/AppDownloadModal';

interface PGPageClientProps {
  initialProperties: PublicProperty[];
}

const LOCALITY_CHIPS = [
  'All Localities',
  'Andheri West',
  'Vile Parle West',
  'Powai',
  'Bandra West',
  'BKC',
  'Dadar West',
];

const GENDER_FILTERS = [
  { id: 'all', label: 'All PGs & Hostels' },
  { id: 'boys', label: 'Boys PG' },
  { id: 'girls', label: 'Girls PG' },
  { id: 'unisex', label: 'Co-Living / Unisex' },
];

const BUDGET_PILLS = [
  { id: 'all', label: 'All Budgets', max: 100000 },
  { id: 'under12', label: 'Under ₹12k/mo', max: 12000 },
  { id: 'under15', label: 'Under ₹15k/mo', max: 15000 },
  { id: 'under20', label: 'Under ₹20k/mo', max: 20000 },
  { id: 'luxury', label: '₹20k+ Executive', min: 20000, max: 100000 },
];

const PG_FAQS = [
  {
    q: 'Are daily meals included in the PG and hostel rent?',
    a: 'Yes! Most verified PGs and hostels listed on REHVO include breakfast, lunch, and dinner cooked fresh daily in hygienic in-house kitchens. Check each listing card for specific meal schedule details.',
  },
  {
    q: 'Does REHVO charge any fees for PGs and hostels?',
    a: 'REHVO connects you directly with the property warden, manager, or building owner with transparent pricing and no hidden fees.',
  },
  {
    q: 'What are the typical curfews and security protocols?',
    a: 'Most student hostels and girls PGs in Mumbai have biometric access, CCTV monitoring, and dedicated female wardens with flexible late-pass rules for students and corporate shifts.',
  },
  {
    q: 'What is the security deposit amount for Mumbai PGs?',
    a: 'Most PGs on REHVO only ask for 1 month of refundable security deposit, with several verified options offering ₹0 Zero Deposit via corporate partnerships.',
  },
  {
    q: 'How do I book a room or schedule an in-person visit?',
    a: 'Simply tap "Book Visit" or "Chat with Warden" on any listing. The REHVO App allows direct instant chat with the property owner and one-tap physical visit slot confirmation.',
  },
];

export const PGPageClient: React.FC<PGPageClientProps> = ({ initialProperties }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [zeroDepositOnly, setZeroDepositOnly] = useState(false);
  const [mealsOnly, setMealsOnly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // Filter listings based on active controls
  const filteredProperties = useMemo(() => {
    return initialProperties.filter((p) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesLocality = p.locality.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLocality && !matchesDesc) return false;
      }

      // Locality chip filter
      if (selectedLocality !== 'All Localities') {
        if (!p.locality.toLowerCase().includes(selectedLocality.toLowerCase())) return false;
      }

      // Gender filter
      if (selectedGender === 'boys') {
        const isBoys = p.tenant_preferences?.includes('bachelors') || p.title.toLowerCase().includes('boy');
        if (!isBoys) return false;
      } else if (selectedGender === 'girls') {
        const isGirls = p.tenant_preferences?.includes('female_only') || p.title.toLowerCase().includes('girl');
        if (!isGirls) return false;
      } else if (selectedGender === 'unisex') {
        const isUnisex = p.title.toLowerCase().includes('co-living') || p.description.toLowerCase().includes('co-living');
        if (!isUnisex) return false;
      }

      // Budget filter
      const activeBudget = BUDGET_PILLS.find((b) => b.id === selectedBudget);
      if (activeBudget) {
        if (activeBudget.min && p.price < activeBudget.min) return false;
        if (activeBudget.max && p.price > activeBudget.max) return false;
      }

      // Zero deposit filter
      if (zeroDepositOnly) {
        if (p.deposit > 0 && !(p as any).isZeroDeposit) return false;
      }

      // Meals included filter
      if (mealsOnly) {
        const hasMeals = p.amenities?.includes('food') || p.description.toLowerCase().includes('meal');
        if (!hasMeals) return false;
      }

      return true;
    });
  }, [initialProperties, searchQuery, selectedLocality, selectedGender, selectedBudget, zeroDepositOnly, mealsOnly]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 01: HERO SECTION */}
      <section className="relative w-full bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white pt-8 pb-12 sm:pb-16 border-b border-[#E2E8F0] overflow-hidden">
        {/* Soft Ambient Emerald Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[350px] rounded-full bg-gradient-to-tr from-[#0F766E]/20 via-[#2DD4BF]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumb items={[{ name: 'PG & Hostels in Mumbai', url: '/pg' }]} />

          {/* Header Title Block */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#CCFBF1] text-[#064E3B] text-xs font-black uppercase tracking-wider border border-[#99F6E4]/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Verified Listing &bull; Direct Wardens &amp; Owners</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
              Verified PGs &amp; Student Hostels in Mumbai
            </h1>

            <p className="text-xs sm:text-base font-medium text-[#64748B] leading-relaxed">
              Find fully furnished private &amp; sharing rooms with home-cooked meals, 300 Mbps WiFi, daily housekeeping, and 24x7 security near top colleges and tech hubs.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full p-1.5 shadow-[0_4px_24px_rgba(3,27,42,0.08)] border border-[#E2E8F0] focus-within:border-[#0F766E] focus-within:shadow-[0_8px_30px_rgba(15,118,110,0.15)] transition-all">
              <Search className="w-5 h-5 text-[#64748B] ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by college (NMIMS, IIT), locality (Andheri, Powai, Bandra)..."
                className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm font-semibold text-[#031B2A] placeholder:text-[#94A3B8] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-xs text-[#64748B] hover:text-[#031B2A] mr-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
            {GENDER_FILTERS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedGender(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedGender === tab.id
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'bg-white text-[#031B2A] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 02: 4 VALUE PILLARS STRIP */}
      <section className="bg-white border-b border-[#E2E8F0] py-6 sm:py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#031B2A]">Verified Listing</div>
                <div className="text-[10px] text-[#64748B] font-semibold">Deal direct with owner</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <Utensils className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#031B2A]">Fresh Meals Daily</div>
                <div className="text-[10px] text-[#64748B] font-semibold">Breakfast, lunch &amp; dinner</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                <Wifi className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#031B2A]">300 Mbps WiFi</div>
                <div className="text-[10px] text-[#64748B] font-semibold">High-speed study &amp; work</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#031B2A]">Biometric &amp; CCTV</div>
                <div className="text-[10px] text-[#64748B] font-semibold">Safe for women &amp; students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03: INTERACTIVE CONTROLS BAR */}
      <section className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] py-3 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          {/* Locality Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-[#64748B] shrink-0">Areas:</span>
            {LOCALITY_CHIPS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocality(loc)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition cursor-pointer ${
                  selectedLocality === loc
                    ? 'bg-[#031B2A] text-white shadow-2xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#031B2A] border border-[#E2E8F0]'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Quick Filters Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Budget Pills */}
              {BUDGET_PILLS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBudget(b.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    selectedBudget === b.id
                      ? 'bg-[#CCFBF1] text-[#064E3B] border border-[#0F766E]/40'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {b.label}
                </button>
              ))}

              {/* Zero Deposit Toggle */}
              <button
                type="button"
                onClick={() => setZeroDepositOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer border ${
                  zeroDepositOnly
                    ? 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Deposit</span>
              </button>

              {/* Meals Included Toggle */}
              <button
                type="button"
                onClick={() => setMealsOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer border ${
                  mealsOnly
                    ? 'bg-[#CCFBF1] text-[#064E3B] border-[#0F766E]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Meals Included</span>
              </button>
            </div>

            <div className="text-xs font-bold text-[#64748B]">
              Showing <span className="text-[#031B2A] font-black">{filteredProperties.length}</span> Verified PGs
            </div>
          </div>
        </div>
      </section>

      {/* 04: LISTINGS GRID */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mx-auto">
              <BedDouble className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-[#031B2A]">No PGs matched these specific filters</h3>
            <p className="text-xs text-[#64748B]">
              Try clearing filters or changing your budget to explore more verified Mumbai PGs and hostels.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedLocality('All Localities');
                setSelectedGender('all');
                setSelectedBudget('all');
                setZeroDepositOnly(false);
                setMealsOnly(false);
              }}
              className="px-5 py-2.5 rounded-full bg-[#0F766E] text-white text-xs font-bold hover:bg-[#064E3B] transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 05: MUMBAI STUDENT & CORPORATE LOCALITIES GUIDE */}
      <section className="bg-white border-t border-[#E2E8F0] py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Top Student &amp; IT PG Hotspots in Mumbai
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Curated locations chosen for walking distance to premier universities, metro access, and IT parks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#0F766E] font-black text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>Vile Parle &amp; Juhu</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Ideal for students of NMIMS, Mithibai, DJ Sanghvi, and NM College. Walking distance to SV Road and Vile Parle Station.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Avg. Rent: ₹14k - ₹22k / bed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#4F46E5] font-black text-sm">
                <GraduationCap className="w-4 h-4" />
                <span>Powai (IIT &amp; Tech)</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Preferred by IIT Bombay students, coders, and startup interns. Peaceful lake views with green campus surroundings.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Avg. Rent: ₹11k - ₹18k / bed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#D97706] font-black text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Andheri West &amp; East</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Mumbai’s most connected transit hub. High concentration of media agencies, SEEPZ, and direct Metro Line 1 &amp; 2A access.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Avg. Rent: ₹12k - ₹19k / bed</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#059669] font-black text-sm">
                <Briefcase className="w-4 h-4" />
                <span>BKC &amp; Bandra East</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Walking distance to the Bharat Diamond Bourse, ICICI, and multinational corporate HQs with zero commute friction.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Avg. Rent: ₹13k - ₹24k / bed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 06: PG & HOSTEL FAQS */}
      <section className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Everything you need to know about booking PGs and hostels in Mumbai with verified marketplace.
          </p>
        </div>

        <div className="space-y-3">
          {PG_FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs transition"
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#031B2A] cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform shrink-0 ${
                    expandedFaq === index ? 'rotate-180 text-[#0F766E]' : ''
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-5 pb-4 text-xs text-[#64748B] leading-relaxed border-t border-[#F1F5F9] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 07: APP DOWNLOAD CTA STRIP */}
      <section className="bg-gradient-to-r from-[#0F766E] to-[#064E3B] text-white py-12 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-black text-[#CCFBF1] uppercase tracking-wider">
              REHVO Mobile Experience
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Chat Directly with PG Wardens &amp; Book Free Visits
            </h3>
            <p className="text-xs sm:text-sm text-[#CCFBF1]/85 leading-relaxed">
              Get 360&deg; room video tours, live vacancy alerts, and exclusive student cashback on the REHVO App.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className="px-6 py-3.5 rounded-full bg-white text-[#064E3B] hover:bg-[#CCFBF1] font-black text-xs sm:text-sm shadow-md transition hover:scale-105 cursor-pointer shrink-0"
          >
            Download REHVO App ↗
          </button>
        </div>
      </section>

      <AppDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Get the REHVO App for PG Bookings"
        subtitle="Connect directly with PG wardens, view verified room videos, and lock verified beds instantly on the app."
      />
    </div>
  );
};
