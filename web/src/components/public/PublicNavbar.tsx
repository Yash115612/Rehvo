'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Building2,
  MapPin,
  Heart,
  Menu,
  X,
  PlusCircle,
  LogOut,
  User,
  GitCompare,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export const PublicNavbar: React.FC = () => {
  const router = useRouter();
  const { user, profile, isAuthenticated, savedPropertyIds, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    router.push('/');
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 w-full max-w-7xl mx-auto pointer-events-none">
      {/* Floating Curved Pill Container */}
      <header className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-xl shadow-stone-900/5 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0 pl-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900 group-hover:bg-purple-600 flex items-center justify-center text-white font-extrabold text-base sm:text-lg shadow-sm transition-colors duration-200">
              R
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-stone-900">
              REHVO<span className="text-purple-600">.</span>
            </span>
          </Link>

          {/* Center: Desktop Navigation Pills */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs sm:text-sm font-bold text-stone-600 bg-stone-100/70 p-1 rounded-full border border-stone-200/60">
            <Link
              href="/mumbai"
              className="px-3.5 py-1.5 rounded-full hover:text-stone-900 hover:bg-white transition-all duration-150 flex items-center gap-1.5"
            >
              <span>Properties</span>
            </Link>
            <Link
              href="/flatmates/mumbai"
              className="px-3.5 py-1.5 rounded-full hover:text-stone-900 hover:bg-white transition-all duration-150 flex items-center gap-1.5"
            >
              <span>Flatmates</span>
            </Link>
            <Link
              href="/pg/mumbai"
              className="px-3.5 py-1.5 rounded-full hover:text-stone-900 hover:bg-white transition-all duration-150 flex items-center gap-1.5"
            >
              <span>PG & Rooms</span>
            </Link>
            <Link
              href="/localities"
              className="px-3.5 py-1.5 rounded-full hover:text-stone-900 hover:bg-white transition-all duration-150 flex items-center gap-1.5"
            >
              <span>Locations</span>
            </Link>
            <Link
              href="/compare/andheri-west-vs-bandra-west"
              className="px-3.5 py-1.5 rounded-full hover:text-stone-900 hover:bg-white transition-all duration-150 flex items-center gap-1.5"
            >
              <span>Compare</span>
            </Link>
          </nav>

          {/* Right: Actions (Saved, List Property, Auth) */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Saved Collection Pill */}
            <Link
              href="/saved"
              className="relative p-2 rounded-full text-stone-600 hover:text-purple-600 hover:bg-stone-100 transition"
              title="Saved Properties"
              aria-label="View saved properties"
            >
              <Heart className="w-4 h-4" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {savedPropertyIds.length}
                </span>
              )}
            </Link>

            {/* List Property (Free) */}
            <Link
              href="/list-property"
              className="text-xs font-bold text-stone-800 hover:text-purple-700 bg-stone-100 hover:bg-purple-50 hover:border-purple-200 border border-stone-200/80 px-4 py-2 rounded-full transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-purple-600" />
              <span>List Property</span>
            </Link>

            {/* Auth State Controls */}
            {isAuthenticated ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-stone-100 hover:bg-stone-200/80 transition border border-stone-200"
                >
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {initial}
                  </div>
                  <span className="text-xs font-bold text-stone-800 max-w-[90px] truncate hidden md:inline-block">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-3xl shadow-2xl border border-stone-200 py-2.5 z-50 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-5 py-3">
                      <p className="text-xs font-extrabold text-stone-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/saved"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <Heart className="w-4 h-4 text-stone-400" />
                        <span>Saved Properties ({savedPropertyIds.length})</span>
                      </Link>
                      <Link
                        href="/list-property"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <PlusCircle className="w-4 h-4 text-stone-400" />
                        <span>Post a Property Listing</span>
                      </Link>
                    </div>

                    <div className="py-1.5">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  href="/login"
                  className="text-xs font-bold text-stone-700 hover:text-stone-900 px-3.5 py-2 rounded-full hover:bg-stone-100 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <Link
              href="/saved"
              className="relative p-2 text-stone-700"
              aria-label="Saved homes"
            >
              <Heart className="w-5 h-5" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedPropertyIds.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-stone-700 hover:bg-stone-100 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Curved Drawer Card */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mt-2 bg-white/95 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-3xl p-5 space-y-4 animate-in slide-in-from-top-3 duration-200">
          <nav className="space-y-1">
            <Link
              href="/mumbai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <Home className="w-4 h-4 text-purple-600" />
              <span>Properties</span>
            </Link>
            <Link
              href="/flatmates/mumbai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Flatmates</span>
            </Link>
            <Link
              href="/pg/mumbai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>PG & Rooms</span>
            </Link>
            <Link
              href="/localities"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>Locations</span>
            </Link>
            <Link
              href="/list-property"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-purple-700 bg-purple-50"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>List a Property</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-stone-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2.5 bg-stone-50 rounded-2xl">
                  <span className="text-xs font-bold text-stone-900 block">{displayName}</span>
                  <span className="text-[11px] text-stone-500 block truncate">{user?.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-rose-600 bg-rose-50 rounded-2xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-xs font-bold text-stone-800 bg-stone-100 rounded-2xl"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-xs font-bold text-white bg-stone-900 rounded-2xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
