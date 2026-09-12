'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Home,
  Building2,
  Building,
  Users,
  LayoutDashboard,
  Smartphone,
  Shield,
  CreditCard,
  ShieldCheck,
  PlusCircle,
  Navigation,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useHeroTheme } from '@/components/v10/HeroThemeContext';
import {
  detectCurrentBrowserLocation,
  getSavedUserLocality,
  saveUserLocality,
  autoDetectOnLoad,
} from '@/services/locationService';

interface ServiceDropdownItem {
  label: string;
  href: string;
  desc: string;
  tag?: string;
  icon: React.ElementType;
}

const SERVICES_DROPDOWN_ITEMS: ServiceDropdownItem[] = [
  {
    label: 'Zero Deposit',
    href: '/services#zero-deposit',
    desc: 'Move in with 0 cash deposit guarantee',
    tag: 'Popular',
    icon: Shield,
  },
  {
    label: 'Rent Pay',
    href: '/services#rent-pay',
    desc: 'Pay rent with credit card & get 1% R-Cash',
    tag: 'Rewards',
    icon: CreditCard,
  },
  {
    label: 'KYC Verification',
    href: '/services#kyc',
    desc: 'Aadhaar e-sign & digital police intimation',
    tag: 'Govt Compliant',
    icon: ShieldCheck,
  },
  {
    label: 'Society Services',
    href: '/society-services',
    desc: 'Smart visitor QR passes & maintenance for RWAs',
    tag: 'For Societies',
    icon: Building2,
  },
];

const NAV_ITEMS = [
  { label: 'Rent', href: '/search', accentColor: '#0F766E' },
  { label: 'PG & Hostel', href: '/pg', accentColor: '#D97706' },
  { label: 'Commercial', href: '/commercial', accentColor: '#2563EB' },
  { label: 'Flatmates', href: '/flatmates', accentColor: '#10B981' },
  { label: 'Services', href: '/services', accentColor: '#0284C7', isDropdown: true },
  { label: 'AI Concierge', href: '/ai-concierge', accentColor: '#0F766E', isAi: true },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { currentAd } = useHeroTheme();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userLocality, setUserLocality] = useState('Bandra West');
  const [isLocating, setIsLocating] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/' || !pathname || pathname === '';

  useEffect(() => {
    setMounted(true);
    const saved = getSavedUserLocality();
    if (saved) {
      setUserLocality(saved.split(',')[0].replace('(GPS)', '').trim());
    } else {
      // Auto-detect location on first visit
      setIsLocating(true);
      autoDetectOnLoad().then((result) => {
        setIsLocating(false);
        if (result?.success) {
          setUserLocality(result.locality);
        }
      });
    }

    // Listen for locality changes from other components
    const handleLocalityChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.locality) {
        setUserLocality(detail.locality.split(',')[0].replace('(GPS)', '').trim());
      }
    };
    window.addEventListener('rehvo-locality-change', handleLocalityChange);
    return () => window.removeEventListener('rehvo-locality-change', handleLocalityChange);
  }, []);

  const handleDetectLocation = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsLocating(true);
    const result = await detectCurrentBrowserLocation();
    setIsLocating(false);
    if (result.success) {
      setUserLocality(result.locality);
    }
  };

  // Listen to scroll to update header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const isNavActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-xs border-b border-stone-200/80 py-2.5'
            : isHomePage
            ? 'bg-transparent backdrop-blur-none py-2.5 sm:py-3 border-b border-transparent'
            : 'bg-white/95 backdrop-blur-xl py-2.5 sm:py-3.5 border-b border-stone-200/70 shadow-2xs'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* =====================================================================
              1. BRAND LOGO LIQUID-GLASS CAPSULE (EXACT REHVO LOGO)
             ===================================================================== */}
          <Link
            href="/"
            className={`pointer-events-auto h-10 sm:h-11 px-3 sm:px-4 rounded-full flex items-center shrink-0 group cursor-pointer transition-all duration-300 ${
              isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
            }`}
          >
            <img
              src="/rehvo-logo.png"
              alt="REHVO"
              width={84}
              height={28}
              style={{ maxHeight: '28px', height: '28px', width: 'auto' }}
              className="h-6 sm:h-7 w-auto object-contain max-h-[28px] group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* =====================================================================
              2. PRIMARY NAVIGATION LIQUID-GLASS CAPSULES (DESKTOP)
             ===================================================================== */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1.5 pointer-events-auto"
          >
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item.href);

              if (item.isDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    ref={servicesRef}
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setServicesDropdownOpen((prev) => !prev)}
                      className={`h-10 px-4 rounded-full text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-200 ${
                        active || servicesDropdownOpen
                          ? 'rehvo-glass-capsule-active font-black text-[#031B2A]'
                          : isScrolled
                          ? 'rehvo-glass-capsule-scrolled font-bold text-[#64748B] hover:text-[#031B2A]'
                          : 'rehvo-glass-capsule font-bold text-[#64748B] hover:text-[#031B2A]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-[#0F766E]' : 'text-[#64748B]'
                        }`}
                      />
                    </button>

                    {servicesDropdownOpen && (
                      <div className="absolute left-0 top-11 w-80 rounded-[24px] bg-white/95 backdrop-blur-xl border border-[#E2E8F0] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                            REHVO Services
                          </span>
                          <Link
                            href="/services"
                            onClick={() => setServicesDropdownOpen(false)}
                            className="text-[11px] font-bold text-[#0F766E] hover:underline"
                          >
                            View All
                          </Link>
                        </div>

                        <div className="py-1.5 space-y-1">
                          {SERVICES_DROPDOWN_ITEMS.map((service) => {
                            const Icon = service.icon;
                            return (
                              <Link
                                key={service.label}
                                href={service.href}
                                onClick={() => setServicesDropdownOpen(false)}
                                className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#F0FDFA] transition-colors"
                              >
                                <div className="w-8 h-8 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#031B2A] group-hover:text-[#0F766E] transition-colors">
                                      {service.label}
                                    </span>
                                    {service.tag && (
                                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        {service.tag}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-[#64748B] line-clamp-1">
                                    {service.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

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
              2.5 LOCATION PILL WITH GPS (DESKTOP)
             ===================================================================== */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className={`hidden md:flex h-10 px-3.5 rounded-full text-xs font-bold items-center gap-2 cursor-pointer transition-all duration-200 ${
              isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
            } ${isLocating ? 'opacity-70 pointer-events-none' : 'hover:border-[#0F766E]/40'}`}
            title="Detect your current location"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 text-[#0F766E] animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-[#0F766E]" />
            )}
            <span className="text-[#031B2A] max-w-[100px] truncate">{userLocality}</span>
            <MapPin className="w-3 h-3 text-[#64748B]" />
          </button>

          {/* =====================================================================
              3. UTILITY CAPSULES & HAMBURGER
             ===================================================================== */}
          <div className="flex items-center gap-2 pointer-events-auto">
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
              className={`h-9 sm:h-10 px-3 sm:px-4.5 rounded-full font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 group cursor-pointer whitespace-nowrap active:scale-95 transition-all duration-200 shrink-0 ${
                isScrolled || !isHomePage
                  ? 'rehvo-glass-capsule-emerald text-white shadow-lg shadow-teal-900/20'
                  : 'bg-[#0F766E]/90 backdrop-blur-md text-white shadow-xl shadow-teal-900/30 border border-white/20'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </Link>

            {/* Mobile Hamburger Toggle (Always crisp, high-contrast, clickable) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle navigation menu"
              className={`md:hidden h-9.5 w-9.5 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 ${
                isScrolled || !isHomePage
                  ? 'bg-white/95 border border-[#E2E8F0] shadow-xs text-[#031B2A] hover:text-[#0F766E] hover:bg-white'
                  : 'bg-white/60 backdrop-blur-md border border-white/40 shadow-lg text-[#031B2A] hover:bg-white/80'
              }`}
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

        </div>
      </header>

      {/* =====================================================================
          4. MOBILE SIDE MENU DRAWER (PORTAL-RENDERED AT DOCUMENT.BODY LEVEL)
         ===================================================================== */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] pointer-events-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#031B2A]/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Side Menu Drawer Panel */}
          <aside
            aria-label="Mobile Navigation Drawer"
            className="fixed inset-y-0 right-0 w-full max-w-[340px] xs:max-w-[360px] bg-white shadow-2xl border-l border-slate-200 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 h-[100dvh]"
          >
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <img
                    src="/rehvo-logo.png"
                    alt="REHVO"
                    width={84}
                    height={28}
                    style={{ maxHeight: '28px', height: '28px', width: 'auto' }}
                    className="h-7 w-auto object-contain max-h-[28px]"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation"
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#031B2A] flex items-center justify-center transition active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Location Detection Card */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="w-full mt-4 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-[#F0FDFA] to-[#CCFBF1]/30 border border-[#0F766E]/20 flex items-center gap-3 transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
                  {isLocating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E] block">
                    {isLocating ? 'Detecting...' : 'Your Location'}
                  </span>
                  <span className="text-xs font-black text-[#031B2A] block truncate">
                    {userLocality}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white text-[#0F766E] border border-[#0F766E]/20">
                    GPS
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                </div>
              </button>

              {/* Navigation Category Cards */}
              <div className="pt-5 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-1 mb-1 block">
                  Marketplace &amp; Discovery
                </span>

                {[
                  { label: 'Rent Homes', href: '/search', icon: Home, color: '#0F766E', tag: 'Verified' },
                  { label: 'PG & Hostel', href: '/pg', icon: Building, color: '#D97706', tag: 'Co-Living' },
                  { label: 'Commercial', href: '/commercial', icon: Building2, color: '#2563EB', tag: 'Offices' },
                  { label: 'Flatmates', href: '/flatmates', icon: Users, color: '#10B981', tag: 'VibeMatch' },
                  { label: 'AI Concierge', href: '/ai-concierge', icon: Sparkles, color: '#0F766E', tag: 'AI Search' },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.href);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full py-2.5 px-3.5 rounded-2xl text-xs font-bold flex items-center justify-between border transition-all ${
                        active
                          ? 'bg-[#F0FDFA] text-[#0F766E] border-[#0F766E]/40 font-black shadow-2xs'
                          : 'bg-white text-[#031B2A] hover:bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${item.color}15`, color: item.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-[#64748B]">
                          {item.tag}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Services 2-Column Grid */}
              <div className="pt-4 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-1 mb-1 block">
                  REHVO Services
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES_DROPDOWN_ITEMS.map((svc) => (
                    <Link
                      key={svc.label}
                      href={svc.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#F0FDFA] border border-slate-100 flex flex-col justify-between transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <svc.icon className="w-3.5 h-3.5 text-[#0F766E]" />
                        {svc.tag && (
                          <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-white text-[#0F766E] border border-slate-100">
                            {svc.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#031B2A] group-hover:text-[#0F766E]">
                        {svc.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support & Quick Links */}
              <div className="pt-4 flex items-center justify-between text-xs text-[#64748B] px-1 border-t border-slate-100 mt-4">
                <Link href="/safety" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0F766E]">
                  Safety
                </Link>
                <span>&bull;</span>
                <Link href="/help" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0F766E]">
                  Help Center
                </Link>
                <span>&bull;</span>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#0F766E]">
                  Contact
                </Link>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
              <Link
                href="/list-property"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-3.5 rounded-2xl bg-gradient-to-r from-[#F0FDFA] to-[#CCFBF1]/50 border border-[#0F766E]/30 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#031B2A] block">Own a Property?</span>
                    <span className="text-[10px] font-semibold text-[#0F766E]">Post for Free &bull; Zero Broker</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0F766E] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#0F766E] hover:bg-[#064E3B] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-900/15 active:scale-95 transition"
              >
                <Smartphone className="w-4 h-4" />
                <span>Download Mobile App</span>
              </Link>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </>
  );
};
