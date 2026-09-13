'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  Building,
  Home,
  Briefcase,
  Layers,
  Video,
  CalendarCheck,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Ticket,
  UserPlus,
  Compass,
  FileCode2,
  HelpCircle,
  MapPin,
  Search,
  Bell,
  Mail,
  Smartphone,
  Sparkles,
  Bot,
  BrainCircuit,
  Sliders,
  LifeBuoy,
  AlertTriangle,
  FileQuestion,
  Bug,
  UserCog,
  ShieldAlert,
  Clock,
  FileCheck2,
  BarChart3,
  LineChart,
  PieChart,
  Shield,
  Key,
  HardDrive,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  Tag,
  Gift,
  Share2,
} from 'lucide-react';
import {
  AdminRole,
  getActiveAdminRole,
  canViewModule,
  ADMIN_ROLE_COLORS,
  ADMIN_ROLE_LABELS,
} from '@/lib/auth/admin-auth';
import { PermissionModule } from '@/types/rbac';
import { ThemeToggle } from './ThemeToggle';
import { getOverviewMetrics, OverviewMetrics } from '@/lib/supabase/admin-service';

interface SubItem {
  label: string;
  href: string;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  id: string;
  title: string;
  icon: React.ElementType;
  permissionModule: PermissionModule;
  href?: string;
  items?: SubItem[];
}

export function AdminSidebar({
  isMobileOpen,
  onMobileClose,
}: {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<AdminRole>('SUPER_ADMIN');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);

  useEffect(() => {
    setRole(getActiveAdminRole());
    getOverviewMetrics().then(setMetrics).catch(() => {});
    const handleRoleChange = (e: any) => {
      setRole(e.detail?.role || 'SUPER_ADMIN');
    };
    window.addEventListener('rehvo-admin-role-change', handleRoleChange);
    return () => window.removeEventListener('rehvo-admin-role-change', handleRoleChange);
  }, []);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      permissionModule: 'dashboard',
      href: '/admin',
    },
    {
      id: 'operations',
      title: 'Operations',
      icon: Building2,
      permissionModule: 'properties',
      items: [
        { label: 'Properties', href: '/admin/properties', badge: metrics?.totalProperties },
        { label: 'Owners', href: '/admin/owners', badge: metrics?.totalOwners },
        { label: 'Renters', href: '/admin/renters', badge: metrics?.totalRenters },
        { label: 'Flatmates', href: '/admin/flatmates' },
        { label: 'PG & Hostel', href: '/admin/pg-hostels', badge: metrics?.totalPgListings && metrics.totalPgListings > 0 ? metrics.totalPgListings : undefined },
        { label: 'Commercial Listings', href: '/admin/commercial', badge: metrics?.totalCommercialListings && metrics.totalCommercialListings > 0 ? metrics.totalCommercialListings : undefined },
        { label: 'Society Services', href: '/admin/society-services' },
        { label: 'ShowReels', href: '/admin/showreels', badge: metrics?.totalShowreels && metrics.totalShowreels > 0 ? metrics.totalShowreels : undefined },
        { label: 'Visits', href: '/admin/visits', badge: metrics?.scheduledVisits && metrics.scheduledVisits > 0 ? metrics.scheduledVisits : undefined },
        { label: 'Chats', href: '/admin/chats' },
        {
          label: 'KYC Verification',
          href: '/admin/kyc',
          badge: metrics?.pendingVerifications && metrics.pendingVerifications > 0 ? metrics.pendingVerifications : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
        },
      ],
    },
    {
      id: 'business',
      title: 'Business',
      icon: CreditCard,
      permissionModule: 'payments',
      items: [
        { label: 'Payments', href: '/admin/payments' },
        { label: 'Revenue', href: '/admin/payments?tab=revenue' },
        { label: 'Coupons', href: '/admin/payments?tab=coupons' },
        { label: 'Referrals', href: '/admin/payments?tab=referrals' },
        { label: 'Subscriptions', href: '/admin/payments?tab=subscriptions' },
      ],
    },
    {
      id: 'content',
      title: 'Content',
      icon: Compass,
      permissionModule: 'cms',
      items: [
        { label: 'Website CMS', href: '/admin/website-cms' },
        { label: 'Homepage Builder', href: '/admin/website-cms?tab=homepage' },
        { label: 'ShowReel CMS', href: '/admin/showreels' },
        { label: 'Blogs', href: '/admin/website-cms?tab=blogs' },
        { label: 'FAQs', href: '/admin/website-cms?tab=faqs' },
        { label: 'Cities', href: '/admin/website-cms?tab=cities' },
        { label: 'SEO Manager', href: '/admin/seo' },
      ],
    },
    {
      id: 'marketing',
      title: 'Marketing',
      icon: Bell,
      permissionModule: 'notifications',
      items: [
        { label: 'Push Notifications', href: '/admin/notifications' },
        { label: 'Email Campaigns', href: '/admin/notifications?tab=email' },
        { label: 'WhatsApp Campaigns', href: '/admin/notifications?tab=whatsapp' },
        { label: 'Banners', href: '/admin/notifications?tab=banners' },
        { label: 'Promotions', href: '/admin/notifications?tab=promotions' },
      ],
    },
    {
      id: 'ai',
      title: 'AI Center',
      icon: Sparkles,
      permissionModule: 'ai',
      items: [
        { label: 'AI Concierge', href: '/admin/ai-control' },
        { label: 'AI Analytics', href: '/admin/ai-control?tab=analytics' },
        { label: 'AI Prompt Manager', href: '/admin/ai-control?tab=prompts' },
        { label: 'AI Knowledge Base', href: '/admin/ai-control?tab=knowledge' },
      ],
    },
    {
      id: 'support',
      title: 'Support',
      icon: LifeBuoy,
      permissionModule: 'support',
      items: [
        {
          label: 'Tickets',
          href: '/admin/support',
          badge: metrics?.openSupportTickets && metrics.openSupportTickets > 0 ? metrics.openSupportTickets : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
        },
        { label: 'Complaints', href: '/admin/support?tab=complaints' },
        { label: 'Contact Requests', href: '/admin/support?tab=contact' },
        { label: 'Bug Reports', href: '/admin/support?tab=bugs' },
      ],
    },
    {
      id: 'team',
      title: 'Team & Staff',
      icon: UserCog,
      permissionModule: 'staff',
      items: [
        { label: 'Staff Directory', href: '/admin/staff' },
        { label: 'Roles & Permissions', href: '/admin/rbac' },
        { label: 'Attendance', href: '/admin/staff?tab=attendance' },
        { label: 'Activity Logs', href: '/admin/activity-logs' },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      permissionModule: 'analytics',
      items: [
        { label: 'Dashboard Analytics', href: '/admin/analytics' },
        { label: 'User Analytics', href: '/admin/analytics?tab=users' },
        { label: 'Revenue Analytics', href: '/admin/analytics?tab=revenue' },
        { label: 'Property Analytics', href: '/admin/analytics?tab=properties' },
        { label: 'ShowReel Analytics', href: '/admin/analytics?tab=showreels' },
        { label: 'City Analytics', href: '/admin/analytics?tab=cities' },
      ],
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      permissionModule: 'security',
      items: [
        { label: 'Audit Logs', href: '/admin/activity-logs' },
        { label: 'Login History', href: '/admin/security?tab=logins' },
        { label: 'Devices', href: '/admin/security?tab=devices' },
        { label: 'API Keys', href: '/admin/security?tab=apikeys' },
        { label: 'Platform Settings', href: '/admin/settings' },
      ],
    },
  ];

  // Filter groups according to the active staff role's permissions
  const visibleGroups = navGroups.filter((g) => canViewModule(role, g.permissionModule));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-[#0A0A0C] border-r border-slate-200 dark:border-white/10 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0E8F73] to-[#10B981] flex items-center justify-center text-white font-extrabold text-lg shadow-glow group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 dark:text-white tracking-wider">REHVO</span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-[#0E8F73]/20 dark:text-[#10B981] border border-emerald-200 dark:border-[#0E8F73]/30">
                  V10
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-none">
                Control Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 select-none">
          {visibleGroups.map((group) => {
            const Icon = group.icon;
            const isSingle = !!group.href;
            const isGroupActive = group.items?.some((i) => pathname === i.href.split('?')[0]);
            const isCollapsed = collapsedGroups[group.id];

            if (isSingle) {
              const isActive = pathname === group.href;
              return (
                <Link
                  key={group.id}
                  href={group.href!}
                  onClick={onMobileClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#0E8F73] text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                    <span>{group.title}</span>
                  </div>
                </Link>
              );
            }

            return (
              <div key={group.id} className="space-y-0.5 pt-2">
                {/* Collapsible Section Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-[#0E8F73] dark:text-[#10B981]" />
                    <span>{group.title}</span>
                  </div>
                  {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </button>

                {/* Subitems */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pl-3 border-l border-slate-200 dark:border-white/5 ml-3 my-0.5">
                    {group.items?.map((item) => {
                      const isActive = pathname === item.href.split('?')[0];
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onMobileClose}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 dark:bg-[#0E8F73]/20 dark:text-[#10B981] dark:border-[#0E8F73]/30'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-full border ${
                                item.badgeColor || 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Role Status Bar */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 shrink-0 bg-slate-50 dark:bg-black/40">
          <div className="p-2.5 rounded-xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-xs">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Active Role</p>
              <p className="text-xs font-extrabold text-[#0E8F73] dark:text-[#10B981] truncate">{ADMIN_ROLE_LABELS[role]}</p>
            </div>
            <Link
              href="/admin/rbac"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400 dark:hover:text-white transition"
              title="Configure Permissions"
            >
              <Sliders size={14} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
