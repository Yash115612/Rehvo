'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  MapPin,
  Check,
  Building,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

const SUPPORTED_LOCATIONS = [
  { id: 'mumbai', label: 'Mumbai (All)', sub: 'South, West & Central' },
  { id: 'andheri', label: 'Andheri West', sub: 'Lokhandwala & Metro' },
  { id: 'bandra', label: 'Bandra West', sub: 'Sea Link & Cafes' },
  { id: 'powai', label: 'Powai', sub: 'Hiranandani & Tech' },
  { id: 'lower_parel', label: 'Lower Parel', sub: 'Corporate Hub' },
  { id: 'thane', label: 'Thane', sub: 'Ghodbunder & Majiwada' },
  { id: 'navi_mumbai', label: 'Navi Mumbai', sub: 'Vashi & Kharghar' },
];

interface NavItem {
  label: string;
  href: string;
  matchPrefix: string[];
  accentColor: string;
}

// Exactly 4 Top-Level Global Destinations (Commercial, PG & Rooms belong to Rent marketplace)
const GLOBAL_NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    matchPrefix: ['/'],
    accentColor: '#0F766E',
  },
  {
    label: 'Rent',
    href: '/rent',
    matchPrefix: ['/rent', '/commercial', '/pg-rooms', '/property', '/mumbai', '/pg', '/rooms', '/studios'],
    accentColor: '#0F766E',
  },
  {
    label: 'Flatmates',
    href: '/flatmates',
    matchPrefix: ['/flatmates'],
    accentColor: '#3C8D68',
  },
  {
    label: 'About',
    href: '/about',
    matchPrefix: ['/about'],
    accentColor: '#031B2A',
  },
];

export const RehvoHeader: React.FC = () => {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  const userRef = useRef<HTMLDivElement>(null);

  // Scroll listener for subtle glass enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isNavActive = (item: NavItem) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return item.matchPrefix.some((prefix) => pathname.startsWith(prefix));
  };

  return (
    <div className="sticky top-3.5 z-50 px-3 sm:px-6 w-full max-w-[1360px] mx-auto pointer-events-none transition-all duration-300">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* ========================================================================= */}
        {/* 1. BRAND LOGO LIQUID-GLASS CAPSULE                                        */}
        {/* ========================================================================= */}
        <Link
          href="/"
          className={`pointer-events-auto h-11 px-3.5 sm:px-4 rounded-full flex items-center group cursor-pointer ${
            isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
          }`}
        >
          <img
            src="/rehvo-logo.png"
            alt="REHVO"
            className="h-7 sm:h-8 w-auto object-contain max-h-[44px]"
            style={{ height: '30px', width: 'auto' }}
          />
        </Link>

        {/* ========================================================================= */}
        {/* 2. PRIMARY NAVIGATION LIQUID-GLASS CAPSULES (Home, Rent, Flatmates, About)*/}
        {/* ========================================================================= */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-2 pointer-events-auto"
        >
          {GLOBAL_NAV_ITEMS.map((item) => {
            const active = isNavActive(item);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`h-10 px-4 rounded-full text-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'rehvo-glass-capsule-active font-black'
                    : isScrolled
                    ? 'rehvo-glass-capsule-scrolled font-bold text-[#64748B] hover:text-[#031B2A]'
                    : 'rehvo-glass-capsule font-bold text-[#64748B] hover:text-[#031B2A]'
                }`}
              >
                <span>{item.label}</span>
                {/* Active Sub-Brand Category Micro-Dot Indicator */}
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

        {/* ========================================================================= */}
        {/* 3. UTILITY LIQUID-GLASS CAPSULES (Location, Saved, Auth, Primary CTA)     */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 pointer-events-auto">

          {/* User Profile / Auth Liquid-Glass Capsule */}
          {user ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className={`h-10 px-3.5 rounded-full text-xs font-bold text-[#031B2A] flex items-center gap-1.5 cursor-pointer ${
                  isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#031B2A] text-white flex items-center justify-center text-[10px] font-bold">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline max-w-[80px] truncate">
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 rehvo-glass-capsule-scrolled rounded-[22px] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/60">
                    <p className="text-xs font-black text-[#031B2A] truncate">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-[10.5px] text-[#64748B] truncate">{user.email}</p>
                  </div>

                  <div className="py-1 space-y-0.5 text-xs font-bold text-[#031B2A]">
                    <Link
                      href="/owner"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-white/80 transition"
                    >
                      <Building className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>Owner Dashboard</span>
                    </Link>
                    <Link
                      href="/enquiries"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-white/80 transition"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#4263EB]" />
                      <span>My Enquiries</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-white/80 transition"
                    >
                      <User className="w-3.5 h-3.5 text-[#3C8D68]" />
                      <span>Profile & Settings</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-white/60">
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
              href="/download"
              className={`hidden sm:flex h-10 px-3.5 xl:px-4 rounded-full text-xs font-bold text-[#0F766E] items-center justify-center cursor-pointer ${
                isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
              }`}
            >
              Download App
            </Link>
          )}

          {/* Primary CTA Liquid-Glass Capsule: Start on REHVO / List Property */}
          <Link
            href="/owner/properties/new"
            className="h-10 px-3.5 sm:px-4 rounded-full rehvo-glass-capsule-coral text-white font-extrabold text-xs flex items-center gap-1.5 group cursor-pointer whitespace-nowrap"
          >
            <span>Start on REHVO</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Mobile Hamburger Menu Liquid-Glass Capsule */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open mobile navigation"
            className={`md:hidden h-10 w-10 rounded-full flex items-center justify-center text-[#031B2A] cursor-pointer ${
              isScrolled ? 'rehvo-glass-capsule-scrolled' : 'rehvo-glass-capsule'
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE LIQUID-GLASS DRAWER NAVIGATION                                  */}
      {/* ========================================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#031B2A]/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
          />

          {/* Liquid-Glass Drawer Container */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm rehvo-glass-capsule-scrolled border-l border-white/80 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0F766E] flex items-center justify-center text-white font-black text-xs shadow-2xs">
                    R
                  </div>
                  <span className="font-black text-lg text-[#031B2A] tracking-tight">REHVO</span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                  className="w-9 h-9 rounded-full rehvo-glass-capsule text-[#031B2A] flex items-center justify-center transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Navigation Individual Liquid-Glass Capsules (Home, Rent, Flatmates, About) */}
              <div className="pt-6 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-2 mb-2 block">
                  Marketplace & Discovery
                </span>

                {GLOBAL_NAV_ITEMS.map((item) => {
                  const active = isNavActive(item);
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
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

              {/* Quick Mobile Utility Capsules */}
              <div className="pt-6 mt-6 border-t border-white/60 space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] px-2 mb-2 block">
                  Account & Shortcuts
                </span>

                {!user && (
                  <Link
                    href="/download"
                    onClick={() => setMobileOpen(false)}
                    className="w-full py-2.5 px-4 rounded-2xl rehvo-glass-capsule text-xs font-bold text-[#0F766E] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#0F766E]" />
                      <span>Download REHVO App</span>
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Drawer Bottom Action */}
            <div className="pt-6 mt-6 border-t border-white/60">
              <Link
                href="/owner/properties/new"
                onClick={() => setMobileOpen(false)}
                className="w-full py-3.5 rounded-2xl rehvo-glass-capsule-coral text-white font-extrabold text-xs flex items-center justify-center gap-2"
              >
                <span>Start on REHVO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
