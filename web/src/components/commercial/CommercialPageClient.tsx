'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Building2,
  Store,
  Briefcase,
  Layers,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  Maximize2,
  Users,
  Car,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { PublicProperty } from '@/lib/seo/types';
import { PropertyCard } from '@/components/v10/PropertyCard';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { AppDownloadModal } from '@/components/public/AppDownloadModal';

interface CommercialPageClientProps {
  initialProperties: PublicProperty[];
}

const COMMERCIAL_HUBS = [
  'All Business Hubs',
  'BKC',
  'Lower Parel',
  'Andheri East',
  'Bandra West',
  'Powai',
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Commercial', icon: Building2 },
  { id: 'office', label: 'Offices & IT Workspaces', icon: Briefcase },
  { id: 'retail', label: 'Retail Shops & Showrooms', icon: Store },
  { id: 'coworking', label: 'Coworking & Flex Desks', icon: Users },
];

const CARPET_AREA_PILLS = [
  { id: 'all', label: 'All Sizes' },
  { id: 'compact', label: '< 1,000 sq.ft', max: 1000 },
  { id: 'mid', label: '1,000 - 2,500 sq.ft', min: 1000, max: 2500 },
  { id: 'large', label: '2,500+ sq.ft Enterprise', min: 2500 },
];

const COMMERCIAL_FAQS = [
  {
    q: 'How does REHVO provide verified listing on commercial leases in Mumbai?',
    a: 'Traditional commercial real estate brokers charge 1 to 2 months rent as commission from both tenant and landlord. REHVO connects enterprise tenants and business owners directly with verified institutional and individual landlords, completely eliminating all broker fees.',
  },
  {
    q: 'What is the standard lease lock-in and agreement period for offices?',
    a: 'Most Mumbai commercial office spaces offer 3 to 5-year registered lease agreements with a 1 to 3-year lock-in period and rent escalations of 5% annually or 15% every 3 years.',
  },
  {
    q: 'Is there a rent-free fit-out period allowed for bare-shell or warm-shell spaces?',
    a: 'Yes, landlords typically offer a 30 to 90-day rent-free fit-out period depending on the size and condition of the commercial floor plate so you can complete your interior setup before rent billing starts.',
  },
  {
    q: 'Are GST and property tax included in the listed rent?',
    a: 'Commercial rents are usually quoted exclusive of 18% GST and building maintenance charges. Exact CAM (Common Area Maintenance) rates per square foot are specified on each verified property card.',
  },
  {
    q: 'How do I schedule an in-person site inspection or lease negotiation?',
    a: 'Click "Book Visit" or "Schedule Inspection" on any listing. The REHVO App lets you confirm site visit times with the building manager and receive direct title documentation.',
  },
];

export const CommercialPageClient: React.FC<CommercialPageClientProps> = ({ initialProperties }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState('All Business Hubs');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [furnishedOnly, setFurnishedOnly] = useState(false);
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

      // Business hub filter
      if (selectedHub !== 'All Business Hubs') {
        if (!p.locality.toLowerCase().includes(selectedHub.toLowerCase())) return false;
      }

      // Category tab filter
      if (selectedCategory === 'office') {
        if (p.type !== 'office') return false;
      } else if (selectedCategory === 'retail') {
        if (p.type !== 'shop' && p.type !== 'showroom') return false;
      } else if (selectedCategory === 'coworking') {
        if (p.type !== 'coworking') return false;
      }

      // Carpet area filter
      const activeArea = CARPET_AREA_PILLS.find((a) => a.id === selectedArea);
      if (activeArea) {
        if (activeArea.min && (p.area || 0) < activeArea.min) return false;
        if (activeArea.max && (p.area || 0) > activeArea.max) return false;
      }

      // Furnished filter
      if (furnishedOnly) {
        if (p.furnishing !== 'fully_furnished') return false;
      }

      return true;
    });
  }, [initialProperties, searchQuery, selectedHub, selectedCategory, selectedArea, furnishedOnly]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 01: HERO SECTION */}
      <section className="relative w-full bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-white pt-8 pb-12 sm:pb-16 border-b border-[#E2E8F0] overflow-hidden">
        {/* Soft Ambient Commercial Blue & Emerald Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[350px] rounded-full bg-gradient-to-tr from-[#2563EB]/15 via-[#0F766E]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <Breadcrumb items={[{ name: 'Commercial Spaces in Mumbai', url: '/commercial' }]} />

          {/* Header Title Block */}
          <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] text-[#1D4ED8] text-[10px] sm:text-xs font-black uppercase tracking-wider border border-[#BFDBFE] shadow-2xs max-w-full truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span className="truncate">Verified Listing &bull; Direct Corporate Landlords</span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#031B2A] tracking-tight leading-tight">
              Grade-A Commercial Offices &amp; Retail in Mumbai
            </h1>

            <p className="text-xs sm:text-base font-medium text-[#64748B] leading-relaxed">
              Lease plug-and-play corporate workspaces, high-street retail shops, prime showrooms, and flex coworking spaces with zero broker commission.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full p-1 sm:p-1.5 shadow-[0_4px_24px_rgba(3,27,42,0.08)] border border-[#E2E8F0] focus-within:border-[#2563EB] focus-within:shadow-[0_8px_30px_rgba(37,99,235,0.15)] transition-all">
              <Search className="w-4 sm:w-5 h-4 sm:h-5 text-[#64748B] ml-3 sm:ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business district (BKC, Lower Parel, MIDC)..."
                className="w-full bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#031B2A] placeholder:text-[#94A3B8] focus:outline-none truncate"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-xs text-[#64748B] hover:text-[#031B2A] mr-1 cursor-pointer shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pt-2">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-[#031B2A] text-white shadow-sm'
                      : 'bg-white text-[#031B2A] border border-[#E2E8F0] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 02: 4 VALUE PILLARS STRIP */}
      <section className="bg-white border-b border-[#E2E8F0] py-6 sm:py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#EEF2FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-black text-[#031B2A] truncate">Verified Marketplace</div>
                <div className="text-[9px] sm:text-[10px] text-[#64748B] font-semibold truncate">Save lease commission</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#031B2A]">Grade-A Towers</div>
                <div className="text-[10px] text-[#64748B] font-semibold">100% DG backup &amp; OC verified</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#031B2A]">Fit-Out Period</div>
                <div className="text-[10px] text-[#64748B] font-semibold">Rent-free customization days</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/80">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#031B2A]">Direct Landlords</div>
                <div className="text-[10px] text-[#64748B] font-semibold">Transparent RERA contracts</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03: INTERACTIVE CONTROLS BAR */}
      <section className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] py-3 shadow-xs">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
          {/* Business Hub Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-[#64748B] shrink-0">Hubs:</span>
            {COMMERCIAL_HUBS.map((hub) => (
              <button
                key={hub}
                type="button"
                onClick={() => setSelectedHub(hub)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 transition cursor-pointer ${
                  selectedHub === hub
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#031B2A] border border-[#E2E8F0]'
                }`}
              >
                {hub}
              </button>
            ))}
          </div>

          {/* Quick Filters Row */}
          <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Carpet Area Pills */}
              {CARPET_AREA_PILLS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedArea(a.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    selectedArea === a.id
                      ? 'bg-[#EEF2FF] text-[#1D4ED8] border border-[#93C5FD]'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]'
                  }`}
                >
                  {a.label}
                </button>
              ))}

              {/* Fully Furnished Plug & Play Toggle */}
              <button
                type="button"
                onClick={() => setFurnishedOnly((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer border ${
                  furnishedOnly
                    ? 'bg-[#CCFBF1] text-[#064E3B] border-[#0F766E]'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Plug &amp; Play Workspaces</span>
              </button>
            </div>

            <div className="text-xs font-bold text-[#64748B]">
              Showing <span className="text-[#031B2A] font-black">{filteredProperties.length}</span> Verified Commercial Spaces
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
            <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#2563EB] flex items-center justify-center mx-auto">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-[#031B2A]">No commercial properties matched these filters</h3>
            <p className="text-xs text-[#64748B]">
              Try selecting all business hubs or changing your carpet area requirements to explore more spaces.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedHub('All Business Hubs');
                setSelectedCategory('all');
                setSelectedArea('all');
                setFurnishedOnly(false);
              }}
              className="px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 05: MUMBAI COMMERCIAL BUSINESS HUBS GUIDE */}
      <section className="bg-white border-t border-[#E2E8F0] py-12 sm:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
              Mumbai&apos;s Premier Commercial Business Districts
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Strategically situated corporate corridors with world-class connectivity and Grade-A infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#2563EB] font-black text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>BKC (Bandra Kurla Complex)</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                India’s marquee financial district. Home to Fortune 500 HQs, consulates, five-star hotels, and Metro Line 3 connectivity.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Rent: ₹180 - ₹350 / sq.ft</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#0F766E] font-black text-sm">
                <Building2 className="w-4 h-4" />
                <span>Lower Parel &amp; Worli</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                The thriving central business and media district. Modern office skyscrapers alongside luxury retail and lifestyle clubs.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Rent: ₹140 - ₹280 / sq.ft</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#D97706] font-black text-sm">
                <Zap className="w-4 h-4" />
                <span>Andheri East &amp; MIDC</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Mumbai’s major IT and logistics core. Seamless connectivity to Chhatrapati Shivaji Airport, Western &amp; Eastern Express Highways.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Rent: ₹85 - ₹160 / sq.ft</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center gap-2 text-[#4F46E5] font-black text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Powai Tech Corridor</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Hiranandani Business Park tech towers, high density of venture-backed startups, and scenic lakeside corporate residences.
              </p>
              <div className="text-[11px] font-bold text-[#031B2A]">Rent: ₹95 - ₹175 / sq.ft</div>
            </div>
          </div>
        </div>
      </section>

      {/* 06: COMMERCIAL LEASING FAQS */}
      <section className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[#031B2A] tracking-tight">
            Commercial Leasing FAQs
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Frequently asked questions by founders, corporate real estate heads, and retail businesses.
          </p>
        </div>

        <div className="space-y-3">
          {COMMERCIAL_FAQS.map((faq, index) => (
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
                    expandedFaq === index ? 'rotate-180 text-[#2563EB]' : ''
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

      {/* 07: COMMERCIAL LEASING ADVISORY CTA */}
      <section className="bg-gradient-to-r from-[#031B2A] via-[#0F766E] to-[#064E3B] text-white py-12 px-4 sm:px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs font-black text-[#99F6E4] uppercase tracking-wider">
              Corporate &amp; Enterprise Real Estate
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Looking for 5,000+ sq.ft Custom Head Office?
            </h3>
            <p className="text-xs sm:text-sm text-[#CCFBF1]/85 leading-relaxed">
              Connect directly with institutional developers, schedule dedicated executive walk-throughs, and close transparent corporate leases.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDownloadModalOpen(true)}
            className="px-6 py-3.5 rounded-full bg-white text-[#031B2A] hover:bg-[#CCFBF1] font-black text-xs sm:text-sm shadow-md transition hover:scale-105 cursor-pointer shrink-0"
          >
            Open Lease Desk in App ↗
          </button>
        </div>
      </section>

      <AppDownloadModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="REHVO Commercial Lease Desk"
        subtitle="Speak directly with verified building owners, review lease deed templates, and confirm site inspections on the app."
      />
    </div>
  );
};
