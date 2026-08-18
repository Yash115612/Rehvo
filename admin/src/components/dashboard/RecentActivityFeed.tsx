'use client';

import React from 'react';
import {
  Building2,
  Users,
  ShieldAlert,
  CheckCircle2,
  CalendarCheck,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { RecentActivityItem } from '@/types/admin';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface RecentActivityFeedProps {
  activities: RecentActivityItem[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'PROPERTY_PUBLISHED':
        return { icon: Building2, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case 'USER_REGISTERED':
        return { icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100' };
      case 'REPORT_FILED':
        return { icon: ShieldAlert, color: 'text-rose-600 bg-rose-50 border-rose-100' };
      case 'VERIFICATION_REQUESTED':
        return { icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case 'VISIT_BOOKED':
      default:
        return { icon: CalendarCheck, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
      <div className="px-5 py-3.5 border-b border-brand-border flex items-center justify-between bg-brand-canvas/30">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-brand-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
            Recent System Activity
          </h3>
        </div>
        <Link
          href="/admin/audit-logs"
          className="text-xs font-bold text-brand-primary hover:underline"
        >
          View Full Audit Log →
        </Link>
      </div>

      <div className="divide-y divide-brand-border/70 max-h-[380px] overflow-y-auto">
        {activities.map((item) => {
          const { icon: Icon, color } = getIcon(item.type);
          return (
            <div
              key={item.id}
              className="p-4 flex items-start gap-3 hover:bg-brand-canvas/40 transition-colors"
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center border ${color} flex-shrink-0 mt-0.5`}
              >
                <Icon size={14} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-brand-dark truncate">
                    {item.title}
                  </p>
                  <span className="text-[10.5px] text-brand-muted flex-shrink-0 font-medium">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>
                <p className="text-[11.5px] text-brand-muted mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
