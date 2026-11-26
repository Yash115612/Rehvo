'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Home,
  Building2,
  Building,
  Users,
  Smartphone,
  Shield,
  CreditCard,
  ShieldCheck,
  User,
  LogOut,
  Heart,
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
  { label: 'Rent', href: '/rent', accentColor: '#001741' },
  { label: 'PG & Hostel', href: '/pg', accentColor: '#F97316' },
  { label: 'Commercial', href: '/commercial', accentColor: '#2563EB' },
  { label: 'Flatmates', href: '/flatmates', accentColor: '#10B981' },
  { label: 'Services', href: '/services', accentColor: '#F97316', isDropdown: true },
  { label: 'AI Concierge', href: '/ai-concierge', accentColor: '#F97316', isAi: true },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const { currentAd } = useHeroTheme();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const servicesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const isHomePage = pathname === '/' || !pathname || pathname === '';

  useEffect(() => {
    setMounted(true);
  }, []);

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
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  // Handle ESC key to dismiss menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setServicesDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    if (href === '/rent') return pathname.startsWith('/rent') || pathname.startsWith('/explore') || pathname === '/search';
    if (href === '/search') return pathname === '/search' || pathname.startsWith('/rent') || pathname.startsWith('/explore');
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-[#001741]/95 backdrop-blur-xl shadow-lg border-b border-white/10 py-2.5'
            : 'bg-[#001741] py-2.5 sm:py-3.5 border-b border-[#001741]'
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* =====================================================================
              1. BRAND LOGO LIQUID-GLASS CAPSULE (EXACT ORIGINAL REHVO LOGO)
             ===================================================================== */}
          <Link
            href="/"
            className="pointer-events-auto h-10 sm:h-11 px-3.5 sm:px-4 rounded-full flex items-center shrink-0 group cursor-pointer transition-all duration-300 bg-white shadow-sm border border-white/90 hover:bg-slate-50"
          >
            <Image
              src="/rehvo-logo.png"
              alt="REHVO"
              width={84}
              height={28}
              priority
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
                      className={`h-10 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-200 shadow-sm ${
                        active || servicesDropdownOpen
                          ? 'bg-[#F97316] text-white border border-[#F97316] shadow-md'
                          : 'bg-white text-[#001741] hover:bg-slate-50 hover:text-[#001741] border border-white/90'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          servicesDropdownOpen || active ? 'rotate-180 text-white' : 'text-[#001741]/70'
                        }`}
                      />
                    </button>

                    {servicesDropdownOpen && (
                      <div
                        style={{ zIndex: 100 }}
                        className="absolute left-0 top-11 w-96 rounded-[24px] bg-white border border-slate-200 shadow-2xl p-3.5 animate-in fade-in slide-in-from-top-2 duration-150"
                      >
                        <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                            REHVO Services
                          </span>
                          <Link
                            href="/services"
                            onClick={() => setServicesDropdownOpen(false)}
                            className="text-[11px] font-bold text-[#F97316] hover:underline"
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
                                className="group flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[#FFF7ED] transition-colors"
                              >
                                <div className="w-8 h-8 rounded-xl bg-[#FFF7ED] text-[#F97316] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#001741] group-hover:text-[#F97316] transition-colors">
                                      {service.label}
                                    </span>
                                    {service.tag && (
                                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
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
                  className={`h-10 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-200 shadow-sm ${
                    active
                      ? 'bg-[#F97316] text-white border border-[#F97316] shadow-md'
                      : 'bg-white text-[#001741] hover:bg-slate-50 hover:text-[#001741] border border-white/90'
                  }`}
                >
                  {item.isAi && <Sparkles className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#F97316]'} animate-pulse`} />}
                  <span>{item.label}</span>
                  {active && (
                    <span
                      className="w-1.5 h-1.5 rounded-full block animate-pulse bg-white"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* =====================================================================
              3. UTILITY CAPSULES & HAMBURGER
             ===================================================================== */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Direct List Property Capsule */}
            <Link
              href="/list-property"
              className="hidden lg:flex h-10 px-4 rounded-full text-xs font-bold items-center gap-1.5 cursor-pointer transition-all bg-white text-[#001741] hover:bg-slate-50 shadow-sm border border-white/90"
            >
              <Home className="w-3.5 h-3.5 text-[#F97316]" />
              <span>List Property</span>
            </Link>

            {/* User Profile / Sign In Capsule */}
            {isAuthenticated ? (
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className="h-10 px-3.5 rounded-full text-xs font-bold text-[#001741] flex items-center gap-1.5 cursor-pointer transition-all bg-white hover:bg-slate-50 shadow-sm border border-white/90"
                >
                  <div className="w-5 h-5 rounded-full bg-[#001741] text-white flex items-center justify-center text-[10px] font-bold">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#001741]/70" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-12 w-56 rounded-[22px] bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-black text-[#001741] truncate">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-[10.5px] text-[#64748B] truncate">{user?.email}</p>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs font-bold text-[#001741]">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FFF7ED] transition"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile & Account</span>
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FFF7ED] transition"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>Saved Properties</span>
                      </Link>
                      <Link
                        href="/safety"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FFF7ED] transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Damage Protection</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 rounded-xl text-xs font-bold text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Sign In"
                className="hidden sm:flex h-10 px-3.5 sm:px-4 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all bg-white text-[#001741] hover:bg-slate-50 shadow-sm border border-white/90"
              >
                <User className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Sign In</span>
              </Link>
            )}

            {/* App Download Capsule Button */}
            <Link
              href="/download"
              className="h-9 sm:h-10 px-3 sm:px-4.5 rounded-full font-extrabold text-[11px] sm:text-xs flex items-center gap-1.5 group cursor-pointer whitespace-nowrap active:scale-95 transition-all duration-200 shrink-0 bg-[#F97316] hover:bg-[#EA580C] text-white shadow-md shadow-orange-950/40 border border-orange-400/30"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </Link>

            {/* Mobile Hamburger Toggle (Always crisp, high-contrast, clickable) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden h-9.5 w-9.5 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 bg-white text-[#001741] hover:bg-slate-50 shadow-sm border border-white/90"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.2]" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
            </button>
          </div>

        </div>
      </header>

      {/* =====================================================================
          4. MOBILE SIDE MENU DRAWER (PORTAL-RENDERED AT DOCUMENT.BODY LEVEL)
         ===================================================================== */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="fixed inset-0 pointer-events-auto" style={{ zIndex: 999999 }}>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#001741]/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
            style={{ zIndex: 999999 }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Side Menu Drawer Panel (Solid white, elevated above backdrop & header) */}
          <aside
            aria-label="Mobile Navigation Drawer"
            style={{ zIndex: 1000000 }}
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
                  <Image
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
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#001741] flex items-center justify-center transition active:scale-95 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Category Cards */}
              <div className="pt-5 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-1 mb-1 block">
                  Marketplace &amp; Discovery
                </span>

                {[
                  { label: 'Rent Homes', href: '/search', icon: Home, color: '#001741', tag: 'Verified' },
                  { label: 'PG & Hostel', href: '/pg', icon: Building, color: '#F97316', tag: 'Co-Living' },
                  { label: 'Commercial', href: '/commercial', icon: Building2, color: '#2563EB', tag: 'Offices' },
                  { label: 'Flatmates', href: '/flatmates', icon: Users, color: '#10B981', tag: 'VibeMatch' },
                  { label: 'AI Concierge', href: '/ai-concierge', icon: Sparkles, color: '#F97316', tag: 'AI Search' },
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
                          ? 'bg-[#FFF7ED] text-[#F97316] border-[#F97316]/40 font-black shadow-2xs'
                          : 'bg-white text-[#001741] hover:bg-slate-50 border-slate-100'
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
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#FFF7ED] border border-slate-100 flex flex-col justify-between transition group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <svc.icon className="w-3.5 h-3.5 text-[#F97316]" />
                        {svc.tag && (
                          <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded bg-white text-[#F97316] border border-slate-100">
                            {svc.tag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-[#001741] group-hover:text-[#F97316]">
                        {svc.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support & Quick Links */}
              <div className="pt-4 flex items-center justify-between text-xs text-[#64748B] px-1 border-t border-slate-100 mt-4">
                <Link href="/safety" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F97316]">
                  Safety
                </Link>
                <span>&bull;</span>
                <Link href="/help" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F97316]">
                  Help Center
                </Link>
                <span>&bull;</span>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#F97316]">
                  Contact
                </Link>
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-2.5">
              <Link
                href="/list-property"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-3.5 rounded-2xl bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5]/50 border border-[#F97316]/30 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#001741] block">Own a Property?</span>
                    <span className="text-[10px] font-semibold text-[#F97316]">Post for Free &bull; Zero Agent</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Sign In / Profile action in drawer */}
              <Link
                href={isAuthenticated ? '/profile' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-white border border-slate-200 text-[#001741] font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:bg-slate-50 transition"
              >
                <User className="w-4 h-4 text-[#F97316]" />
                <span>{isAuthenticated ? 'My Profile & Account' : 'Sign In / Register'}</span>
              </Link>

              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-900/15 active:scale-95 transition"
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
