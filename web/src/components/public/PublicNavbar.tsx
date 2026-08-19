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
  Smartphone,
  PlusCircle,
  LogOut,
  User,
  CalendarCheck,
  MessageSquare,
  Shield,
  GitCompare,
  ChevronDown,
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

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:bg-purple-700 transition">
              R
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-stone-900">
              REHVO<span className="text-purple-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-stone-600">
            <Link
              href="/mumbai"
              className="hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Home className="w-4 h-4 text-stone-400" />
              <span>Mumbai Rentals</span>
            </Link>
            <Link
              href="/flatmates/mumbai"
              className="hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-stone-400" />
              <span>Flatmates</span>
            </Link>
            <Link
              href="/pg/mumbai"
              className="hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-stone-400" />
              <span>PG & Rooms</span>
            </Link>
            <Link
              href="/localities"
              className="hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-stone-400" />
              <span>Localities</span>
            </Link>
            <Link
              href="/compare/andheri-west-vs-bandra-west"
              className="hover:text-purple-600 transition flex items-center gap-1.5"
            >
              <GitCompare className="w-4 h-4 text-stone-400" />
              <span>Compare</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Saved Properties Button */}
            <Link
              href="/saved"
              className="relative p-2.5 rounded-2xl text-stone-600 hover:text-purple-600 hover:bg-stone-100 transition"
              title="Saved Properties"
              aria-label="View saved properties"
            >
              <Heart className="w-5 h-5" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {savedPropertyIds.length}
                </span>
              )}
            </Link>

            {/* List Property (Free) */}
            <Link
              href="/list-property"
              className="text-xs font-bold text-stone-800 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 px-4 py-2.5 rounded-2xl transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>List Property</span>
            </Link>

            {/* Auth State Controls */}
            {isAuthenticated ? (
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-stone-100 transition border border-transparent hover:border-stone-200"
                >
                  <div className="w-8 h-8 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {initial}
                  </div>
                  <span className="text-xs font-bold text-stone-800 max-w-[100px] truncate hidden md:inline-block">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3">
                      <p className="text-xs font-extrabold text-stone-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/saved"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <Heart className="w-4 h-4 text-stone-400" />
                        <span>Saved Properties ({savedPropertyIds.length})</span>
                      </Link>
                      <Link
                        href="/list-property"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <PlusCircle className="w-4 h-4 text-stone-400" />
                        <span>Post a Property Listing</span>
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-stone-700 hover:text-stone-900 px-3 py-2.5 rounded-2xl hover:bg-stone-100 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href="/saved"
              className="relative p-2 text-stone-700"
              aria-label="Saved homes"
            >
              <Heart className="w-5 h-5" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedPropertyIds.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="space-y-1">
            <Link
              href="/mumbai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <Home className="w-4 h-4 text-purple-600" />
              <span>Mumbai Rentals</span>
            </Link>
            <Link
              href="/flatmates/mumbai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Flatmates</span>
            </Link>
            <Link
              href="/pg/mumbai"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>PG & Rooms</span>
            </Link>
            <Link
              href="/localities"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>Localities Directory</span>
            </Link>
            <Link
              href="/list-property"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-purple-700 bg-purple-50"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>List Property (Zero Brokerage)</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-stone-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2 bg-stone-50 rounded-xl">
                  <span className="text-xs font-bold text-stone-900 block">{displayName}</span>
                  <span className="text-[11px] text-stone-500 block truncate">{user?.email}</span>
                </div>
                <Link
                  href="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold text-stone-700"
                >
                  <span>Saved Properties</span>
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {savedPropertyIds.length}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl"
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
                  className="w-full text-center py-2.5 text-xs font-bold text-stone-800 bg-stone-100 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-stone-900 rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
