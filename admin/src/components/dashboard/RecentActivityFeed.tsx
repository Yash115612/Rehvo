'use client';

import React from 'react';
import { Activity, Building2, User, ShieldCheck, CreditCard, Video, CalendarCheck } from 'lucide-react';
import { RecentActivityItem } from '@/types/admin';
import Link from 'next/link';

export function RecentActivityFeed({ activities }: { activities: RecentActivityItem[] }) {
  const currentActivities = activities || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECEIVED':
        return CreditCard;
      case 'PROPERTY_PUBLISHED':
        return Building2;
      case 'USER_REGISTERED':
        return User;
      case 'VISIT_BOOKED':
        return CalendarCheck;
      case 'SHOWREEL_UPLOADED':
        return Video;
      case 'REPORT_FILED':
        return ShieldCheck;
      default:
        return Activity;
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#0E8F73] dark:text-[#10B981]" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Live Platform Activity Stream
          </h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 dark:text-[#10B981] bg-emerald-50 dark:bg-[#10B981]/15 px-2 py-0.5 rounded border border-emerald-200 dark:border-[#10B981]/30">
          Realtime Feed
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5 my-2">
        {currentActivities.length > 0 ? (
          currentActivities.map((act) => {
            const Icon = getIcon(act.type);
            return (
              <div key={act.id} className="py-2.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 text-[#0E8F73] dark:text-[#10B981] mt-0.5">
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{act.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{act.description}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">No Recent Events</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
              Platform activities and listing actions will appear live as events occur.
            </p>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Immutable staff trace recorded in PostgreSQL</span>
        <Link href="/admin/activity-logs" className="text-[#0E8F73] dark:text-[#10B981] font-bold hover:underline">
          View Audit Logs →
        </Link>
      </div>
    </div>
  );
}
