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
  Home,
  Building2,
  Users,
  LayoutDashboard,
  Smartphone,
  Shield,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useHeroTheme } from '@/components/v10/HeroThemeContext';

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
  const { isAuthenticated, hasPublishedProperty, hasFlatmateProfile } = useAuth();
  const { currentAd } = useHeroTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);

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
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            2. PRIMARY NAVIGATION LIQUID-GLASS CAPSULES
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
            3. UTILITY LIQUID-GLASS CAPSULES (LOCATION, SAVED & SINGLE BUTTON CTA)
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
            className="h-9 sm:h-10 px-3 sm:px-4.5 rounded-full rehvo-glass-capsule-emerald text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 group cursor-pointer whitespace-nowrap shadow-lg shadow-teal-900/20 active:scale-95 transition-all duration-200 shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Download App</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Toggle navigation menu"
            className={`md:hidden h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-[#031B2A] cursor-pointer transition shrink-0 ${
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

          <div className="fixed inset-y-0 right-0 w-full max-w-[320px] sm:max-w-sm rehvo-glass-capsule-scrolled border-l border-white/80 shadow-2xl p-5 sm:p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
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

                  if (item.isDropdown) {
                    return (
                      <div key={item.label} className="space-y-1">
                        <Link
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

                        <div className="pl-3 pr-1 py-1 space-y-1">
                          {SERVICES_DROPDOWN_ITEMS.map((svc) => (
                            <Link
                              key={svc.label}
                              href={svc.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F766E] flex items-center justify-between hover:bg-white/60 transition"
                            >
                              <span>{svc.label}</span>
                              {svc.tag && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700">
                                  {svc.tag}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

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
