'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ShieldAlert,
  LifeBuoy,
  FileCheck2,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { PendingActionItem } from '@/types/admin';

interface PendingActionsChecklistProps {
  actions: PendingActionItem[];
}

export function PendingActionsChecklist({ actions }: PendingActionsChecklistProps) {
  if (!actions || actions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-brand-border p-6 text-center">
        <CheckCircle2 size={32} className="mx-auto text-brand-success mb-2" />
        <h3 className="text-sm font-bold text-brand-dark">No Pending Actions</h3>
        <p className="text-xs text-brand-muted mt-1">
          All verifications, safety reports, and support tickets are resolved.
        </p>
      </div>
    );
  }

  const getSeverityBadge = (severity: PendingActionItem['severity']) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getIcon = (category: PendingActionItem['category']) => {
    switch (category) {
      case 'VERIFICATION':
        return CheckCircle2;
      case 'REPORT':
        return ShieldAlert;
      case 'SUPPORT':
        return LifeBuoy;
      case 'MODERATION':
      default:
        return FileCheck2;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
      <div className="px-5 py-3.5 border-b border-brand-border flex items-center justify-between bg-brand-canvas/30">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
            Pending Operational Actions
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          {actions.reduce((acc, a) => acc + a.count, 0)} Items Requiring Attention
        </span>
      </div>

      <div className="divide-y divide-brand-border">
        {actions.map((item) => {
          const Icon = getIcon(item.category);
          return (
            <Link
              key={item.id}
              href={item.route}
              className="px-5 py-3.5 flex items-center justify-between hover:bg-brand-canvas/60 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-brand-canvas border border-brand-border flex items-center justify-center text-brand-dark flex-shrink-0 group-hover:border-brand-primary group-hover:text-brand-primary transition-colors">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-brand-dark group-hover:text-brand-primary transition-colors truncate">
                      {item.title}
                    </p>
                    <span
                      className={`text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getSeverityBadge(
                        item.severity
                      )}`}
                    >
                      {item.severity} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-brand-muted mt-0.5 truncate">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="text-xs font-extrabold text-brand-dark px-2 py-0.5 rounded bg-brand-canvas border border-brand-border">
                  {item.count}
                </span>
                <ArrowRight
                  size={15}
                  className="text-brand-muted group-hover:text-brand-primary group-hover:translate-x-0.5 transition-all"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
