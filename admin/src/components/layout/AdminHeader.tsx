'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Plus,
  ShieldCheck,
  ExternalLink,
  Check,
  AlertCircle,
  Database,
} from 'lucide-react';
import { getPendingActions } from '@/lib/supabase/admin-service';
import { PendingActionItem } from '@/types/admin';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingActionItem[]>([]);

  useEffect(() => {
    getPendingActions().then((actions) => setPendingActions(actions));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/users?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const totalPending = pendingActions.reduce((acc, a) => acc + a.count, 0);

  return (
    <header className="h-16 bg-white border-b border-brand-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Dynamic Title or Quick Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
          />
          <input
            type="text"
            placeholder="Search users, listings, reports, or logs... (Enter to search)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-canvas pl-9 pr-12 py-1.5 rounded-lg border border-brand-border text-[13px] text-brand-dark placeholder:text-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-brand-muted bg-white border border-brand-border px-1.5 py-0.5 rounded shadow-2xs">
            ↵
          </kbd>
        </form>
      </div>

      {/* Right: Operational Controls */}
      <div className="flex items-center gap-3">
        {/* Supabase Status Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-success-light border border-brand-success/30 text-brand-success text-[11.5px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
          <Database size={12} className="text-brand-success" />
          <span>Supabase Live</span>
        </div>

        {/* Quick Action Button */}
        <Link
          href="/admin/verification"
          className="flex items-center gap-1.5 bg-brand-dark hover:bg-brand-primary text-white text-[12.5px] font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Quick Action</span>
        </Link>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-brand-muted hover:text-brand-dark hover:bg-brand-canvas transition-colors border border-transparent hover:border-brand-border"
            aria-label="Admin Notifications"
          >
            <Bell size={18} />
            {totalPending > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-popover border border-brand-border py-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-2 border-b border-brand-border flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  Alerts & Tasks
                </h4>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-primary-light text-brand-primary">
                  {totalPending} Pending
                </span>
              </div>
              <div className="divide-y divide-brand-border/60 max-h-72 overflow-y-auto">
                {pendingActions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-brand-muted">
                    No pending operational alerts
                  </div>
                ) : (
                  pendingActions.map((action) => (
                    <Link
                      key={action.id}
                      href={action.route}
                      onClick={() => setNotificationsOpen(false)}
                      className="p-3 hover:bg-brand-canvas/60 cursor-pointer transition-colors block"
                    >
                      <p className="text-xs font-semibold text-brand-dark">{action.title}</p>
                      <p className="text-[11px] text-brand-muted mt-0.5">{action.subtitle}</p>
                    </Link>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-brand-border text-center">
                <Link
                  href="/admin/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-bold text-brand-primary hover:underline"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile View Mobile App Shortcut */}
        <a
          href="https://rehvo.com"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1 text-[12px] font-semibold text-brand-muted hover:text-brand-dark px-2.5 py-1.5 rounded-lg border border-brand-border hover:bg-brand-canvas transition-colors"
        >
          <span>App</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </header>
  );
}
