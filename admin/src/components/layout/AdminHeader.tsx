'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Bell,
  Command,
  Menu,
  ShieldCheck,
  LogOut,
  ExternalLink,
  ChevronDown,
  User,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { StaffStatusPill } from './StaffStatusPill';
import { CommandPalette } from './CommandPalette';
import { ThemeToggle } from './ThemeToggle';
import { getActiveAdminUser } from '@/lib/auth/admin-auth';

export function AdminHeader({ onMobileMenuToggle }: { onMobileMenuToggle?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const currentUser = getActiveAdminUser();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getBreadcrumb = () => {
    if (pathname === '/admin') return 'Overview Dashboard';
    const parts = pathname.replace('/admin/', '').split('/');
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')).join(' / ');
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 w-full bg-[#050505]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
              REHVO V10
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-slate-300 truncate max-w-xs">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Center: Global Search Pill */}
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-xs text-slate-400 hover:border-[#10B981]/40 hover:text-slate-200 transition shadow-xs group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Search size={14} className="text-slate-500 group-hover:text-[#10B981] transition" />
            <span className="truncate">Search properties, owners, renters, tickets, showreels...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Theme Switcher (Light / Dark) */}
          <ThemeToggle />

          {/* Live Staff Online Status & Role Switcher */}
          <StaffStatusPill />

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981]" />
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 top-12 w-80 bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">3 New</span>
                </div>
                <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                  <div className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">14 Title Deeds Pending Review</p>
                      <p className="text-[11px] text-slate-400">Bandra & Worli residential listings require KYC approval.</p>
                      <span className="text-[10px] text-slate-500">12m ago</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">New Owner Onboarded</p>
                      <p className="text-[11px] text-slate-400">Aditya Birla listed 2 apartments in BKC.</p>
                      <span className="text-[10px] text-slate-500">35m ago</span>
                    </div>
                  </div>
                  <div className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Flagged Safety Report</p>
                      <p className="text-[11px] text-slate-400">Reported duplicate listing in Powai.</p>
                      <span className="text-[10px] text-slate-500">1h ago</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 text-center">
                  <Link
                    href="/admin/activity-logs"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="text-[11px] font-bold text-[#10B981] hover:underline"
                  >
                    View Complete Audit Trail →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#10B981]/50"
              />
              <span className="hidden xl:inline-block text-xs font-bold text-white max-w-[100px] truncate">
                {currentUser.full_name.split(' ')[0]}
              </span>
              <ChevronDown size={13} className="text-slate-400 hidden xl:inline-block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-12 w-64 bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-white truncate">{currentUser.full_name}</p>
                  <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                  <p className="text-[10px] text-[#10B981] font-extrabold mt-1">
                    {currentUser.employee_id} • {currentUser.department}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <Link
                    href="/admin/staff"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <User size={14} className="text-slate-400" />
                    <span>Staff Directory & Profile</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <ShieldCheck size={14} className="text-slate-400" />
                    <span>Platform Settings</span>
                  </Link>
                  <a
                    href="https://www.rehvo.in"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={14} className="text-[#10B981]" />
                      <span>Live Website</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-500" />
                  </a>
                </div>

                <div className="pt-1.5 mt-1.5 border-t border-white/10">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      router.push('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition font-bold"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Command Palette Omnibox */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </>
  );
}
