'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Building2,
  Users,
  ShieldCheck,
  CreditCard,
  Video,
  Ticket,
  UserCog,
  Sparkles,
  ArrowRight,
  Command,
  X,
  FileCheck,
  Bell,
  Settings,
} from 'lucide-react';

interface SearchItem {
  id: string;
  category: 'PROPERTIES' | 'USERS' | 'ACTIONS' | 'SYSTEM' | 'SHOWREELS';
  title: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Quick Actions
  { id: 'act-prop-new', category: 'ACTIONS', title: 'Add New Property Listing', subtitle: 'Open listing editor with GPS and media', href: '/admin/properties', icon: Building2 },
  { id: 'act-kyc-review', category: 'ACTIONS', title: 'Review Pending KYC & Deeds', subtitle: '14 documents awaiting verification', href: '/admin/kyc', icon: ShieldCheck },
  { id: 'act-showreel-upload', category: 'ACTIONS', title: 'Upload ShowReel Video', subtitle: 'Schedule new promotional video for web', href: '/admin/showreels', icon: Video },
  { id: 'act-notify-broadcast', category: 'ACTIONS', title: 'Broadcast Push Notification', subtitle: 'Dispatch to Mumbai renters or owners', href: '/admin/notifications', icon: Bell },
  { id: 'act-invite-staff', category: 'ACTIONS', title: 'Invite New Staff Member', subtitle: 'Provision employee account & RBAC', href: '/admin/staff', icon: UserCog },

  // Properties & Inventory
  { id: 'prop-01', category: 'PROPERTIES', title: '2 BHK Luxury Apartment, Bandra West', subtitle: 'Active • ₹85,000/mo • ID: prp_01', href: '/admin/properties', icon: Building2 },
  { id: 'prop-02', category: 'PROPERTIES', title: 'Sea-Facing Penthouse, Worli', subtitle: 'Pending Review • ₹2,40,000/mo • ID: prp_02', href: '/admin/properties', icon: Building2 },
  { id: 'prop-03', category: 'PROPERTIES', title: 'Single Private Room in Co-living, Powai', subtitle: 'Active • ₹22,000/mo • ID: prp_03', href: '/admin/pg-hostels', icon: Building2 },
  { id: 'prop-04', category: 'PROPERTIES', title: 'Grade-A Commercial Office, BKC', subtitle: 'Commercial • ₹4,50,000/mo • ID: prp_04', href: '/admin/commercial', icon: Building2 },

  // Users & Profiles
  { id: 'usr-01', category: 'USERS', title: 'Aditya Birla (Owner)', subtitle: '3 Active Listings • Verified • Bandra', href: '/admin/owners', icon: Users },
  { id: 'usr-02', category: 'USERS', title: 'Sneha Kapoor (Renter)', subtitle: 'Looking for 2 BHK in Andheri • KYC Verified', href: '/admin/renters', icon: Users },
  { id: 'usr-03', category: 'USERS', title: 'Rahul Nair (Flatmate Seeker)', subtitle: 'VibeMatch Profile • Budget ₹25k', href: '/admin/flatmates', icon: Users },

  // ShowReels
  { id: 'sr-01', category: 'SHOWREELS', title: 'Bandra West Verified Walkthrough', subtitle: 'Residential • 14.2k views • Active', href: '/admin/showreels', icon: Video },
  { id: 'sr-02', category: 'SHOWREELS', title: 'BKC Premium Workspace Tour', subtitle: 'Commercial • 8.6k views • Trending', href: '/admin/showreels', icon: Video },

  // System & Settings
  { id: 'sys-ai', category: 'SYSTEM', title: 'AI Concierge Prompt Manager', subtitle: 'Configure GPT-4 system prompts & guidelines', href: '/admin/ai-control', icon: Sparkles },
  { id: 'sys-payments', category: 'SYSTEM', title: 'Payments & Revenue Center', subtitle: 'Invoices, refunds and Razorpay transactions', href: '/admin/payments', icon: CreditCard },
  { id: 'sys-support', category: 'SYSTEM', title: 'Customer Support Tickets', subtitle: '8 unresolved tickets requiring response', href: '/admin/support', icon: Ticket },
  { id: 'sys-rbac', category: 'SYSTEM', title: 'RBAC Permission Matrix', subtitle: 'Manage role toggles & access rules', href: '/admin/rbac', icon: UserCog },
  { id: 'sys-audit', category: 'SYSTEM', title: 'Immutable Audit Logs', subtitle: 'Full administrative trace history', href: '/admin/activity-logs', icon: FileCheck },
  { id: 'sys-settings', category: 'SYSTEM', title: 'Platform Governance Settings', subtitle: 'Security policies and maintenance toggles', href: '/admin/settings', icon: Settings },
];

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filtered = SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        ref={paletteRef}
        className="w-full max-w-xl bg-white dark:bg-[#0D0D11] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-white/10 gap-3">
          <Search size={18} className="text-[#0E8F73] dark:text-[#10B981] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, property, user, showreel, or staff..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-500 dark:text-slate-400">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              No matching records or actions found for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-white dark:border-[#10B981]/30'
                      : 'hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#0E8F73] text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={14} className="text-[#0E8F73] dark:text-[#10B981]" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Command Bar Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-black/40 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-mono">↑</kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-mono">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-mono">↵</kbd> to open
            </span>
          </div>
          <span className="text-[#0E8F73] dark:text-[#10B981] font-semibold flex items-center gap-1">
            <Command size={11} /> REHVO Global Search
          </span>
        </div>
      </div>
    </div>
  );
}
