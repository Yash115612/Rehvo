'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { PendingActionItem } from '@/types/admin';

export function PendingActionsChecklist({ actions }: { actions: PendingActionItem[] }) {
  const currentActions = actions || [];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-amber-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Operational Triage Queue
          </h3>
        </div>
        {currentActions.length > 0 ? (
          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-400/20">
            {currentActions.length} Action{currentActions.length === 1 ? '' : 's'} Required
          </span>
        ) : (
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-400/20 flex items-center gap-1">
            <CheckCircle2 size={11} /> All Clear
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5 my-2">
        {currentActions.length > 0 ? (
          currentActions.map((action) => (
            <div key={action.id} className="py-3 flex items-center justify-between gap-3 group">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      action.severity === 'HIGH' ? 'bg-rose-500 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0E8F73] dark:group-hover:text-[#10B981] transition-colors truncate">
                    {action.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-4 mt-0.5 truncate">{action.subtitle}</p>
              </div>

              <Link
                href={action.route}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0E8F73] hover:text-white text-xs font-bold text-slate-700 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-[#0E8F73] dark:hover:text-white transition shadow-2xs shrink-0"
              >
                <span>Resolve</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          ))
        ) : (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Triage Queue is Clear</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
              All properties are verified and there are no open flags or support escalations.
            </p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>All systems operating within SLA thresholds</span>
        <Link href="/admin/kyc" className="text-[#0E8F73] dark:text-[#10B981] font-bold hover:underline">
          View All KYC →
        </Link>
      </div>
    </div>
  );
}
