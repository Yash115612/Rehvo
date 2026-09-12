'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MapPin,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Check,
  ArrowRight,
  Heart,
  Home,
  Building2,
  Users,
  LayoutDashboard,
  Smartphone,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useHeroTheme } from '@/components/v10/HeroThemeContext';

const NAV_ITEMS = [
  { label: 'Rent', href: '/search', accentColor: '#0F766E' },
  { label: 'PG & Hostel', href: '/pg', accentColor: '#D97706' },
  { label: 'Commercial', href: '/commercial', accentColor: '#2563EB' },
  { label: 'Flatmates', href: '/flatmates', accentColor: '#10B981' },
  { label: 'Services', href: '/services', accentColor: '#0284C7' },
  { label: 'Society', href: '/society-services', accentColor: '#7C3AED' },
  { label: 'AI Concierge', href: '/ai-concierge', accentColor: '#0F766E', isAi: true },
];

const LOCALITIES = [
  'Mumbai (All)',
  'Bandra West',
  'Andheri West',
  'Powai',
  'Worli & Lower Parel',
  'BKC',
  'Juhu',
  'Thane West',
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hasPublishedProperty, hasFlatmateProfile, savedPropertyIds } = useAuth();
  const { currentAd } = useHeroTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [ctaDropdownOpen, setCtaDropdownOpen] = useState(false);
  const [selectedLocality, setSelectedLocality] = useState('Mumbai (All)');
  const [localSavedCount, setLocalSavedCount] = useState(0);

  useEffect(() => {
    const updateSavedCount = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('rehvo_saved_properties') || '[]');
        setLocalSavedCount(Array.isArray(stored) ? stored.length : 0);
      } catch {
        setLocalSavedCount(0);
      }
    };
    updateSavedCount();
    window.addEventListener('rehvo_saved_updated', updateSavedCount);
    window.addEventListener('storage', updateSavedCount);
    return () => {
      window.removeEventListener('rehvo_saved_updated', updateSavedCount);
      window.removeEventListener('storage', updateSavedCount);
    };
  }, []);

  const totalSavedCount = (savedPropertyIds && savedPropertyIds.length > 0) ? savedPropertyIds.length : localSavedCount;

  const locationRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/' || !pathname || pathname === '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setLocationOpen(false);
      }
      if (ctaRef.current && !ctaRef.current.contains(e.target as Node)) {
        setCtaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCtaOption = (path: string) => {
    setCtaDropdownOpen(false);
    router.push(path);
  };

  const isNavActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-in-out ${
        isScrolled
          ? 'bg-white/92 backdrop-blur-xl shadow-xs border-b border-stone-200/70 py-2.5'
          : isHomePage
          ? 'bg-transparent py-3 border-b border-transparent'
          : 'bg-[#F8FAFC]/90 backdrop-blur-md py-3.5 border-b border-stone-200/40'
      }`}
      style={{
        backgroundColor: isScrolled
          ? undefined
          : isHomePage
          ? 'transparent'
          : undefined,
      }}
    >
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* =====================================================================
            1. BRAND LOGO LIQUID-GLASS CAPSULE (EXACT REHVO LOGO)
           ===================================================================== */}
        <Link
          href="/"
          className={`pointer-events-auto h-11 px-4 rounded-full flex items-center group cursor-pointer transition-all duration-300 ${
            isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
          }`}
        >
          <img
            src="/rehvo-logo.png"
            alt="REHVO"
            width={84}
            height={28}
            style={{ maxHeight: '28px', height: '28px', width: 'auto' }}
            className="h-7 w-auto object-contain max-h-[28px] group-hover:scale-105 transition-transform"
          />
        </Link>

        {/* =====================================================================
            2. PRIMARY NAVIGATION LIQUID-GLASS CAPSULES
           ===================================================================== */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-1.5 pointer-events-auto"
        >
          {NAV_ITEMS.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`h-10 px-4 rounded-full text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  active
                    ? 'rehvo-glass-capsule-active font-black'
                    : isScrolled
                    ? 'rehvo-glass-capsule-scrolled font-bold text-[#64748B] hover:text-[#031B2A]'
                    : 'rehvo-glass-capsule font-bold text-[#64748B] hover:text-[#031B2A]'
                }`}
              >
                {item.isAi && <Sparkles className="w-3.5 h-3.5 text-[#0F766E] animate-pulse" />}
                <span>{item.label}</span>
                {active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full block animate-pulse"
                    style={{ backgroundColor: item.accentColor }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* =====================================================================
            3. UTILITY LIQUID-GLASS CAPSULES (LOCATION, SAVED & SINGLE BUTTON CTA)
           ===================================================================== */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Location Selector Capsule */}
          <div className="relative hidden sm:block" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationOpen((prev) => !prev)}
              aria-label="Select City or Locality"
              className={`h-10 px-3.5 rounded-full text-xs font-bold text-[#031B2A] flex items-center gap-1.5 cursor-pointer transition-all ${
                isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
              <span className="max-w-[90px] truncate">{selectedLocality}</span>
              <ChevronDown
                className={`w-3 h-3 text-[#64748B] transition-transform duration-200 ${
                  locationOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {locationOpen && (
              <div className="absolute right-0 top-12 w-60 rehvo-glass-capsule-scrolled rounded-[22px] shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-white/60">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                    Select Mumbai Region
                  </span>
                </div>
                <div className="py-1 space-y-0.5 max-h-56 overflow-y-auto no-scrollbar">
                  {LOCALITIES.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocality(loc);
                        setLocationOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-white/80 transition text-[#031B2A] cursor-pointer"
                    >
                      <span>{loc}</span>
                      {selectedLocality === loc && (
                        <Check className="w-3.5 h-3.5 text-[#0F766E]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Saved Capsule */}
          <Link
            href="/search?filter=saved"
            aria-label="Saved properties"
            className={`hidden sm:flex h-10 px-3.5 rounded-full text-xs font-bold items-center gap-1.5 cursor-pointer transition-all ${
              isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                totalSavedCount > 0
                  ? 'fill-[#EF4444] text-[#EF4444]'
                  : 'text-[#64748B] hover:text-[#0F766E]'
              }`}
            />
            {totalSavedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-black">
                {totalSavedCount}
              </span>
            )}
          </Link>

          {/* Direct List Property Capsule */}
          <Link
            href="/list-property"
            className={`hidden lg:flex h-10 px-4 rounded-full text-xs font-bold items-center gap-1.5 cursor-pointer transition-all ${
              isScrolled ? 'rehvo-glass-capsule-scrolled text-[#031B2A]' : 'rehvo-glass-capsule text-[#031B2A] hover:text-[#0F766E]'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>List Property</span>
          </Link>

          {/* App Download Capsule Button */}
          <Link
            href="/download"
            className="h-10 px-4 sm:px-4.5 rounded-full rehvo-glass-capsule-emerald text-white font-extrabold text-xs flex items-center gap-1.5 group cursor-pointer whitespace-nowrap shadow-lg shadow-teal-900/20 active:scale-95 transition-all duration-200"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>App</span>
          </Link>

          {/* SINGLE BUTTON TYPE: "Start on REHVO" Popover (Secondary on large screens, compact on mid screens) */}
          <div className="relative hidden xl:block" ref={ctaRef}>
            <button
              type="button"
              onClick={() => setCtaDropdownOpen((prev) => !prev)}
              className={`h-10 px-3.5 rounded-full text-xs font-bold flex items-center gap-1.5 group cursor-pointer whitespace-nowrap transition-all ${
                isScrolled ? 'rehvo-glass-capsule-scrolled text-[#031B2A]' : 'rehvo-glass-capsule text-[#031B2A]'
              }`}
            >
              <span>Explore</span>
              <ChevronDown className={`w-3 h-3 text-[#64748B] transition-transform duration-200 ${ctaDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Single Button Options Popover Dialog */}
            {ctaDropdownOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-[26px] shadow-2xl border border-stone-200/90 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-2 pb-2.5 border-b border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span className="font-extrabold text-xs text-[#031B2A] uppercase tracking-wider">
                      Start on REHVO
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCtaDropdownOpen(false)}
                    className="p-1 rounded-full text-[#64748B] hover:text-[#031B2A] hover:bg-stone-100 transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-2 space-y-1.5">
                  {/* Option 1: Residential Property */}
                  <button
                    type="button"
                    onClick={() => handleCtaOption('/list-property')}
                    className="w-full text-left p-3 rounded-2xl hover:bg-[#CCFBF1]/50 border border-transparent hover:border-[#99F6E4] transition flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-[#CCFBF1] text-[#0F766E] group-hover:bg-[#0F766E] group-hover:text-white transition shrink-0 mt-0.5">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-[#031B2A] group-hover:text-[#0F766E] transition">
                          List Residential Flat
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        Flats, rooms, PGs &amp; verified listings
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Commercial Space */}
                  <button
                    type="button"
                    onClick={() => handleCtaOption('/list-property?type=commercial')}
                    className="w-full text-left p-3 rounded-2xl hover:bg-[#EEF2FF]/60 border border-transparent hover:border-[#C7D2FE] transition flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-[#EEF2FF] text-[#4F46E5] group-hover:bg-[#4F46E5] group-hover:text-white transition shrink-0 mt-0.5">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-[#031B2A] group-hover:text-[#4F46E5] transition">
                          List Commercial Space
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        Offices, retail shops &amp; workspaces
                      </p>
                    </div>
                  </button>

                  {/* Option 3: Flatmate Profile */}
                  <button
                    type="button"
                    onClick={() => handleCtaOption('/flatmates')}
                    className="w-full text-left p-3 rounded-2xl hover:bg-[#DCFCE7]/60 border border-transparent hover:border-[#BBF7D0] transition flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-[#DCFCE7] text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition shrink-0 mt-0.5">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-[#031B2A] group-hover:text-[#16A34A] transition">
                          Find Roommates
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#64748B] group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                        Connect with compatible flatmates
                      </p>
                    </div>
                  </button>

                  {/* Option 4: Download Mobile App */}
                  <button
                    type="button"
                    onClick={() => handleCtaOption('/download')}
                    className="w-full text-left p-3 rounded-2xl bg-[#F0FDFA] hover:bg-[#CCFBF1]/50 border border-[#99F6E4] transition flex items-start gap-3 group cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-[#0F766E] text-white transition shrink-0 mt-0.5 shadow-sm shadow-teal-900/20">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-[#0F766E] transition">
                          Download REHVO App
                        </span>
                        <ArrowRight className="w-3 h-3 text-[#0F766E] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#0F766E]/80 mt-0.5 leading-snug">
                        Instant visits, owner &amp; broker chat, transparent pricing
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle navigation menu"
            className={`md:hidden h-10 w-10 rounded-full flex items-center justify-center text-[#031B2A] cursor-pointer transition ${
              isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* =====================================================================
          4. MOBILE LIQUID-GLASS DRAWER
         ===================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto">
          <div
            className="fixed inset-0 bg-[#031B2A]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-sm rehvo-glass-capsule-scrolled border-l border-white/80 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/60">
                <img
                  src="/rehvo-logo.png"
                  alt="REHVO"
                  width={84}
                  height={28}
                  style={{ maxHeight: '28px', height: '28px', width: 'auto' }}
                  className="h-7 w-auto object-contain max-h-[28px]"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="w-9 h-9 rounded-full rehvo-glass-capsule text-[#031B2A] flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="pt-6 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-2 mb-2 block">
                  Marketplace &amp; Discovery
                </span>

                {NAV_ITEMS.map((item) => {
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full py-3 px-4 rounded-2xl text-sm font-bold flex items-center justify-between transition-all duration-200 ${
                        active
                          ? 'rehvo-glass-capsule-active font-black'
                          : 'rehvo-glass-capsule text-[#031B2A]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {active && (
                          <span
                            className="w-2 h-2 rounded-full block animate-pulse"
                            style={{ backgroundColor: item.accentColor }}
                          />
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4 opacity-50" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Drawer CTA */}
            <div className="pt-6 mt-6 border-t border-white/60 space-y-2.5">
              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-2xl rehvo-glass-capsule-emerald text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-900/20"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download Mobile App</span>
              </Link>
              <Link
                href="/list-property"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl rehvo-glass-capsule text-[#031B2A] font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Start on REHVO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
