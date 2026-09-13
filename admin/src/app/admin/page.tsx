'use client';

import React, { useEffect, useState } from 'react';
import { OverviewMetricCards } from '@/components/dashboard/OverviewMetricCards';
import { RevenueChartWidget } from '@/components/dashboard/RevenueChartWidget';
import { SignupAndUploadGraphs } from '@/components/dashboard/SignupAndUploadGraphs';
import { PendingActionsChecklist } from '@/components/dashboard/PendingActionsChecklist';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { ServerHealthCard } from '@/components/dashboard/ServerHealthCard';
import { OverviewMetrics, RecentActivityItem, PendingActionItem } from '@/types/admin';
import {
  RefreshCw,
  ShieldCheck,
  Building2,
  Users,
  Video,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  ExternalLink,
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
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* 1. Header Bar with Title & Operational Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              REHVO Platform Control Center
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              Live V10 Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time ecosystem operations, verification queue, listings velocity, and infrastructure health
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200 transition shadow-xs disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync DB</span>
          </button>

          <Link
            href="/admin/kyc"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-white text-xs font-extrabold transition shadow-glow cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span>Review KYC ({metrics?.pendingVerifications ?? 0})</span>
          </Link>
        </div>
      </div>

      {/* 2. 12 Live KPI Cards Grid */}
      {metrics ? (
        <OverviewMetricCards metrics={metrics} />
      ) : (
        <div className="p-12 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 text-center flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Loader2 size={16} className="animate-spin text-[#0E8F73] dark:text-[#10B981]" />
          <span>Synchronizing live metrics from Supabase PostgreSQL...</span>
        </div>
      )}

      {/* 3. Revenue Velocity Chart */}
      <RevenueChartWidget monthlyRevenue={metrics?.revenueMonth} />

      {/* 4. Locality Demand Heatmap + AI Concierge Telemetry */}
      <SignupAndUploadGraphs totalProperties={metrics?.totalProperties} />

      {/* 5. Two-Column Operational Queue: Triage Checklist + Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PendingActionsChecklist actions={pendingActions} />
        <RecentActivityFeed activities={recentActivities} />
      </div>

      {/* 6. Infrastructure & DB Health Heartbeat */}
      <ServerHealthCard />

      {/* 7. Quick Ecosystem Jump Links */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Quick Operational Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/properties"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Building2 size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0E8F73] dark:group-hover:text-[#10B981] truncate">Properties</p>
              <p className="text-[10px] text-slate-500">{metrics?.totalProperties ?? 0} listed</p>
            </div>
          </Link>

          <Link
            href="/admin/owners"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Users size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0E8F73] dark:group-hover:text-[#10B981] truncate">Owners</p>
              <p className="text-[10px] text-slate-500">{metrics?.totalOwners ?? 0} registered</p>
            </div>
          </Link>

          <Link
            href="/admin/showreels"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Video size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0E8F73] dark:group-hover:text-[#10B981] truncate">ShowReels</p>
              <p className="text-[10px] text-slate-500">{metrics?.totalShowreels ?? 0} videos</p>
            </div>
          </Link>

          <Link
            href="/admin/payments"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
              <CreditCard size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0E8F73] dark:group-hover:text-[#10B981] truncate">Payments</p>
              <p className="text-[10px] text-slate-500">₹{((metrics?.revenueMonth ?? 0) / 100000).toFixed(1)}L Inventory</p>
            </div>
          </Link>

          <Link
            href="/admin/ai-control"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0E8F73] dark:group-hover:text-[#10B981] truncate">AI Concierge</p>
              <p className="text-[10px] text-slate-500">Prompts & KB</p>
            </div>
          </Link>

          <Link
            href="/admin/website-cms"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 hover:border-emerald-500/40 hover:bg-slate-100 dark:hover:bg-white/5 transition flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ExternalLink size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0E8F73] dark:group-hover:text-[#10B981] truncate">Website CMS</p>
              <p className="text-[10px] text-slate-500">Live editor</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
