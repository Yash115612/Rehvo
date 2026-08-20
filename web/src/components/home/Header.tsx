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
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { HeaderUnifiedCTA } from '@/components/public/HeaderUnifiedCTA';

export const Header: React.FC = () => {
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
    { label: 'Properties', href: '/mumbai' },
    { label: 'Flatmates', href: '/flatmates/mumbai' },
    { label: 'PG & Rooms', href: '/pg/mumbai' },
    { label: 'Locations', href: '/localities' },
    { label: 'About', href: '/about' },
  ];

  return (
    <div className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 w-full max-w-7xl mx-auto pointer-events-none">
      {/* Floating Capsule Header Container */}
      <header className="pointer-events-auto bg-white/95 backdrop-blur-2xl border border-stone-200/90 shadow-xl shadow-stone-900/5 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0 pl-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900 group-hover:bg-purple-600 flex items-center justify-center text-white font-extrabold text-base sm:text-lg shadow-sm transition-colors duration-200">
              R
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900">
              REHVO<span className="text-purple-600">.</span>
            </span>
          </Link>

          {/* Center Navigation Pills (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs sm:text-sm font-bold text-stone-600 bg-stone-100/80 p-1 rounded-full border border-stone-200/60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'hover:text-stone-900 hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Saved Properties Heart */}
            <Link
              href="/saved"
              className="relative p-2.5 rounded-full text-stone-600 hover:text-purple-600 hover:bg-stone-100 transition"
              title="Saved Properties"
              aria-label="View saved properties"
            >
              <Heart className="w-4 h-4" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                  {savedPropertyIds.length}
                </span>
              )}
            </Link>

            {/* Unified Multi-Action CTA */}
            <HeaderUnifiedCTA />

            {/* Auth / Profile Button */}
            {user ? (
              <div ref={userRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold transition"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-extrabold">
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
                      <User className="w-4 h-4 text-purple-600" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/owner"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50"
                    >
                      <Building className="w-4 h-4 text-purple-600" />
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
                className="text-xs font-extrabold text-stone-800 hover:text-stone-950 px-3 py-2 rounded-full hover:bg-stone-100 transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/saved"
              className="p-2 text-stone-700 hover:text-purple-600"
              aria-label="Saved"
            >
              <Heart className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-stone-800 hover:text-purple-600"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileOpen && (
          <div className="sm:hidden pt-4 pb-2 border-t border-stone-200 mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
              <Link
                href="/owner/properties/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white text-xs font-extrabold py-2.5 rounded-xl shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Your Property</span>
              </Link>
              <Link
                href="/flatmates/create"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-stone-100 text-stone-800 text-xs font-extrabold py-2.5 rounded-xl border border-stone-200"
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span>Find Flatmate</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
