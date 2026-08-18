'use client';

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { OverviewMetricCards } from '@/components/dashboard/OverviewMetricCards';
import { PendingActionsChecklist } from '@/components/dashboard/PendingActionsChecklist';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { OverviewMetrics, RecentActivityItem, PendingActionItem } from '@/types/admin';
import {
  RefreshCw,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  CalendarCheck,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import {
  getOverviewMetrics,
  getRecentActivities,
  getPendingActions,
} from '@/lib/supabase/admin-service';

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [pendingActions, setPendingActions] = useState<PendingActionItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [m, pa, ra] = await Promise.all([
        getOverviewMetrics(),
        getPendingActions(),
        getRecentActivities(),
      ]);
      setMetrics(m);
      setPendingActions(pa);
      setRecentActivities(ra);
    } catch (err) {
      console.warn('[Admin Overview] Failed to load metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Actions */}
      <PageHeader
        title="Platform Overview"
        subtitle="Real-time operations, verification queue, and safety monitoring"
        badge="Live Metrics"
      >
        <button
          onClick={loadDashboardData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-border bg-white text-brand-dark text-xs font-bold hover:bg-brand-canvas transition-colors shadow-2xs disabled:opacity-60"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>

        <Link
          href="/admin/verification"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-bold hover:bg-brand-primary-hover transition-colors shadow-2xs"
        >
          <ShieldCheck size={14} />
          <span>Review Verifications</span>
        </Link>
      </PageHeader>

      {/* 2. Key Operational Metrics Grid (8 Tiles) */}
      {metrics ? (
        <OverviewMetricCards metrics={metrics} />
      ) : (
        <div className="bg-white rounded-xl border border-brand-border p-8 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
          <Loader2 size={16} className="animate-spin text-brand-primary" />
          <span>Loading platform metrics...</span>
        </div>
      )}

      {/* 3. Operational Two-Column Grid: Pending Actions + Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Actions Queue */}
        <PendingActionsChecklist actions={pendingActions} />

        {/* Right: Recent System Activity Feed */}
        <RecentActivityFeed activities={recentActivities} />
      </div>

      {/* 4. Quick Ops Shortcuts */}
      <div className="bg-white rounded-xl border border-brand-border p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
          Quick Operational Jump Links
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/users"
            className="p-3 rounded-lg border border-brand-border bg-brand-canvas/40 hover:bg-brand-canvas hover:border-brand-primary/30 transition-all flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
              <Users size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-dark group-hover:text-brand-primary truncate">User Directory</p>
              <p className="text-[10.5px] text-brand-muted">{metrics ? `${metrics.totalUsers} accounts` : 'Accounts'}</p>
            </div>
          </Link>

          <Link
            href="/admin/properties"
            className="p-3 rounded-lg border border-brand-border bg-brand-canvas/40 hover:bg-brand-canvas hover:border-brand-primary/30 transition-all flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Building2 size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-dark group-hover:text-brand-primary truncate">Listings Table</p>
              <p className="text-[10.5px] text-brand-muted">{metrics ? `${metrics.totalProperties} properties` : 'Listings'}</p>
            </div>
          </Link>

          <Link
            href="/admin/verification"
            className="p-3 rounded-lg border border-brand-border bg-brand-canvas/40 hover:bg-brand-canvas hover:border-brand-primary/30 transition-all flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-dark group-hover:text-brand-primary truncate">Verify Deeds</p>
              <p className="text-[10.5px] text-emerald-700 font-semibold">
                {metrics ? `${metrics.pendingVerifications} pending review` : 'Verifications'}
              </p>
            </div>
          </Link>

          <Link
            href="/admin/audit-logs"
            className="p-3 rounded-lg border border-brand-border bg-brand-canvas/40 hover:bg-brand-canvas hover:border-brand-primary/30 transition-all flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
              <CalendarCheck size={14} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-brand-dark group-hover:text-brand-primary truncate">Audit Logs</p>
              <p className="text-[10.5px] text-brand-muted">Full trace history</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
