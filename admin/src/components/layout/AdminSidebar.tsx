'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  MessageSquare,
  CalendarCheck,
  LifeBuoy,
  ShieldAlert,
  CheckCircle2,
  FileCheck2,
  Bell,
  MapPin,
  Sparkles,
  BarChart3,
  UserCog,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_ADMIN_USER, ADMIN_ROLE_LABELS, ADMIN_ROLE_COLORS } from '@/lib/auth/admin-auth';
import { getOverviewMetrics } from '@/lib/supabase/admin-service';

interface NavSection {
  title?: string;
  items: {
    label: string;
    href: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const roleStyle = ADMIN_ROLE_COLORS[MOCK_ADMIN_USER.role];
  const [counts, setCounts] = useState<{
    verifications: number;
    reports: number;
    support: number;
  }>({
    verifications: 0,
    reports: 0,
    support: 0,
  });

  useEffect(() => {
    getOverviewMetrics().then((m) => {
      setCounts({
        verifications: m.pendingVerifications,
        reports: m.openReports,
        support: m.openSupportTickets,
      });
    });
  }, []);

  const navSections: NavSection[] = [
    {
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Users', href: '/admin/users', icon: Users, badge: 'Live' },
        { label: 'Properties', href: '/admin/properties', icon: Building2 },
        { label: 'Flatmates', href: '/admin/flatmates', icon: UserCheck },
        { label: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
        { label: 'Visits', href: '/admin/visits', icon: CalendarCheck },
        {
          label: 'Support',
          href: '/admin/support',
          icon: LifeBuoy,
          badge: counts.support > 0 ? counts.support : undefined,
          badgeColor: 'bg-amber-100 text-amber-800',
        },
      ],
    },
    {
      title: 'TRUST & SAFETY',
      items: [
        {
          label: 'Verification',
          href: '/admin/verification',
          icon: CheckCircle2,
          badge: counts.verifications > 0 ? counts.verifications : undefined,
          badgeColor: 'bg-indigo-100 text-indigo-700',
        },
        {
          label: 'Reports',
          href: '/admin/reports',
          icon: ShieldAlert,
          badge: counts.reports > 0 ? counts.reports : undefined,
          badgeColor: 'bg-rose-100 text-rose-700',
        },
        { label: 'Moderation', href: '/admin/verification?tab=moderation', icon: FileCheck2 },
      ],
    },
    {
      title: 'CONTENT',
      items: [
        { label: 'Notifications', href: '/admin/notifications', icon: Bell },
        { label: 'Locations', href: '/admin/locations', icon: MapPin },
        { label: 'Featured Content', href: '/admin/properties?tab=featured', icon: Sparkles },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Admin Users', href: '/admin/admin-users', icon: UserCog },
        { label: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-brand-border flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-brand-border">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-dark flex items-center justify-center text-white font-extrabold text-lg tracking-tighter shadow-sm group-hover:bg-brand-primary transition-colors">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-brand-dark text-base">
                REHVO
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-primary-light text-brand-primary border border-brand-primary/20">
                Control
              </span>
            </div>
            <p className="text-[10.5px] text-brand-muted font-medium">Ops & Governance</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <h4 className="px-3 text-[10.5px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                {section.title}
              </h4>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150 group',
                    isActive
                      ? 'bg-brand-dark text-white shadow-sm'
                      : 'text-brand-dark/80 hover:bg-brand-canvas hover:text-brand-dark'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={17}
                      className={cn(
                        'flex-shrink-0 transition-colors',
                        isActive
                          ? 'text-brand-primary-light'
                          : 'text-brand-muted group-hover:text-brand-dark'
                      )}
                      strokeWidth={isActive ? 2.3 : 2}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'text-[10.5px] font-bold px-1.5 py-0.5 rounded-full',
                        item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-brand-canvas text-brand-muted border border-brand-border')
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Footer Profile & Sign Out */}
      <div className="p-3 border-t border-brand-border bg-brand-canvas/60">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-brand-border shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={MOCK_ADMIN_USER.avatar_url}
              alt={MOCK_ADMIN_USER.full_name}
              className="w-8 h-8 rounded-full object-cover border border-brand-border flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-brand-dark truncate">
                {MOCK_ADMIN_USER.full_name}
              </p>
              <span
                className="inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded"
                style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
              >
                {ADMIN_ROLE_LABELS[MOCK_ADMIN_USER.role]}
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="p-1.5 rounded-md text-brand-muted hover:text-brand-danger hover:bg-brand-danger-light transition-colors"
            title="Sign out of Admin"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
