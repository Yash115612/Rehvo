'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  MessageSquare,
  Bell,
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  ChevronDown,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { HeaderUnifiedCTA } from '@/components/public/HeaderUnifiedCTA';

export const PublicNavbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    user,
    profile,
    isAuthenticated,
    savedPropertyIds,
    unreadNotificationsCount,
    unreadMessagesCount,
    signOut,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    }

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

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
              className={`px-3.5 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5 ${
                pathname === '/mumbai' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900 hover:bg-white'
              }`}
            >
              <span>Properties</span>
            </Link>
            <Link
              href="/flatmates/mumbai"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5 ${
                pathname.startsWith('/flatmates') ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900 hover:bg-white'
              }`}
            >
              <span>Flatmates</span>
            </Link>
            <Link
              href="/pg/mumbai"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5 ${
                pathname.startsWith('/pg') ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900 hover:bg-white'
              }`}
            >
              <span>PG & Rooms</span>
            </Link>
            <Link
              href="/localities"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5 ${
                pathname === '/localities' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900 hover:bg-white'
              }`}
            >
              <span>Locations</span>
            </Link>
            <Link
              href="/about"
              className={`px-3.5 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5 ${
                pathname === '/about' ? 'bg-white text-stone-900 shadow-sm' : 'hover:text-stone-900 hover:bg-white'
              }`}
            >
              <span>About</span>
            </Link>
          </nav>

          {/* Right: Actions (Saved, Messages, Notifications, Unified CTA, Auth) */}
          <div className="hidden sm:flex items-center space-x-2">
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

            {/* Authenticated Fast Links (Chat & Notifications) */}
            {isAuthenticated && (
              <>
                <Link
                  href="/chat"
                  className="relative p-2 rounded-full text-stone-600 hover:text-purple-600 hover:bg-stone-100 transition"
                  title="Messages"
                  aria-label="View chat messages"
                >
                  <MessageSquare className="w-4 h-4" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-purple-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/notifications"
                  className="relative p-2 rounded-full text-stone-600 hover:text-purple-600 hover:bg-stone-100 transition"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-amber-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* ONE UNIFIED ACTION BUTTON (List Property / Create Flatmate) */}
            <HeaderUnifiedCTA />

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

                {/* User Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-stone-200 py-2.5 z-50 divide-y divide-stone-100 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-5 py-3">
                      <p className="text-xs font-extrabold text-stone-900 truncate">{displayName}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        <span>Profile Hub</span>
                      </Link>
                      <Link
                        href="/saved"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <Heart className="w-4 h-4 text-stone-400" />
                        <span>Saved Properties ({savedPropertyIds.length})</span>
                      </Link>
                      <Link
                        href="/enquiries"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <ClipboardList className="w-4 h-4 text-stone-400" />
                        <span>My Enquiries</span>
                      </Link>
                      <Link
                        href="/visits"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <CalendarCheck className="w-4 h-4 text-stone-400" />
                        <span>Scheduled Visits</span>
                      </Link>
                    </div>

                    {/* Owner & Flatmate Hubs */}
                    <div className="py-1.5">
                      <Link
                        href="/owner"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-purple-700 hover:bg-purple-50 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-600" />
                        <span>Owner Dashboard</span>
                      </Link>
                      <Link
                        href="/flatmates/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-purple-50 hover:text-purple-700 transition"
                      >
                        <Users className="w-4 h-4 text-stone-400" />
                        <span>My Flatmate Profile</span>
                      </Link>
                    </div>

                    <div className="py-1.5">
                      <Link
                        href="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                      >
                        <Settings className="w-4 h-4 text-stone-400" />
                        <span>Settings</span>
                      </Link>
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
                  className="bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold px-4 py-2 rounded-full shadow-sm transition"
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

            {isAuthenticated && (
              <Link
                href="/chat"
                className="relative p-2 text-stone-700"
                aria-label="Chat messages"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-purple-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadMessagesCount}
                  </span>
                )}
              </Link>
            )}

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
        <div className="pointer-events-auto mt-2 bg-white/95 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-3xl p-5 space-y-4 animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Unified Start CTA */}
          <div className="pb-2">
            <HeaderUnifiedCTA isMobileDrawer onNavigate={() => setMobileMenuOpen(false)} />
          </div>

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
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-stone-800 hover:bg-purple-50 hover:text-purple-700"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>About</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-stone-100 space-y-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2.5 bg-stone-50 rounded-2xl">
                  <span className="text-xs font-bold text-stone-900 block">{displayName}</span>
                  <span className="text-[11px] text-stone-500 block truncate">{user?.email}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-stone-50 rounded-2xl text-center text-stone-800 hover:bg-purple-50"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/owner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-purple-50 text-purple-700 rounded-2xl text-center font-bold"
                  >
                    Owner Hub
                  </Link>
                  <Link
                    href="/enquiries"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-stone-50 rounded-2xl text-center text-stone-800"
                  >
                    Enquiries
                  </Link>
                  <Link
                    href="/visits"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-stone-50 rounded-2xl text-center text-stone-800"
                  >
                    Visits
                  </Link>
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
