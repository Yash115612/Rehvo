'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Menu,
  X,
  PlusCircle,
  Building,
  Users,
  ChevronDown,
  User,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { HeaderUnifiedCTA } from '@/components/public/HeaderUnifiedCTA';

export const RehvoHeader: React.FC = () => {
  const pathname = usePathname();
  const { user, profile, savedPropertyIds, signOut } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Rent', href: '/mumbai', hasDropdown: true },
    { label: 'Flatmates', href: '/flatmates/mumbai' },
    { label: 'PG & Rooms', href: '/pg/mumbai' },
    { label: 'Localities', href: '/localities' },
    { label: 'About', href: '/about' },
  ];

  return (
    <div className="sticky top-4 z-50 px-4 sm:px-8 w-full max-w-[1400px] mx-auto pointer-events-none">
      {/* Floating Capsule Bar */}
      <header className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-5 sm:px-7 py-3 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5533] to-[#FF7744] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-stone-900 leading-none">
                REHVO
              </span>
              <span className="text-[8px] font-bold text-[#FF5533] tracking-widest uppercase mt-0.5">
                Rent. Live. Belong.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold text-stone-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 transition-colors ${
                    isActive
                      ? 'text-[#FF5533] font-extrabold'
                      : 'text-stone-700 hover:text-[#FF5533]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Saved Properties */}
            <Link
              href="/saved"
              className="flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-[#FF5533] transition"
            >
              <Heart className="w-4 h-4 text-[#FF5533]" />
              <span>Saved</span>
              {savedPropertyIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FF5533] text-white text-[9px] font-extrabold flex items-center justify-center">
                  {savedPropertyIds.length}
                </span>
              )}
            </Link>

            {/* Auth / Login */}
            {user ? (
              <div ref={userRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FF5533] text-white flex items-center justify-center text-[10px] font-extrabold">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[80px] truncate">{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
                    >
                      <User className="w-4 h-4 text-[#FF5533]" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/owner"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
                    >
                      <Building className="w-4 h-4 text-[#FF5533]" />
                      <span>Owner Dashboard</span>
                    </Link>
                    <div className="border-t border-stone-100 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-extrabold text-stone-800 hover:text-stone-950 px-2 py-1 transition"
              >
                Login
              </Link>
            )}

            {/* Start on REHVO Button with Popover */}
            <HeaderUnifiedCTA />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/saved"
              className="p-2 text-stone-700 hover:text-[#FF5533]"
              aria-label="Saved"
            >
              <Heart className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-stone-800 hover:text-[#FF5533]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="sm:hidden pt-4 pb-2 border-t border-stone-200 mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-orange-50 hover:text-[#FF5533]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <Link
                href="/owner/properties/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#FF5533] text-white text-xs font-extrabold py-2.5 rounded-xl shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Property</span>
              </Link>
              <Link
                href="/flatmates/create"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 text-xs font-extrabold py-2.5 rounded-xl border border-stone-200"
              >
                <Users className="w-4 h-4 text-[#FF5533]" />
                <span>Create Flatmate Profile</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
