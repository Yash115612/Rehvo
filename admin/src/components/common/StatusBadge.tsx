'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const getStyle = () => {
    switch (normalized) {
      case 'ACTIVE':
      case 'VERIFIED':
      case 'PUBLISHED':
      case 'RESOLVED':
      case 'CONFIRMED':
      case 'SUCCESS':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'PENDING':
      case 'UNDER_REVIEW':
      case 'REQUESTED':
      case 'INVITED':
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'SUSPENDED':
      case 'REJECTED':
      case 'BLOCKED':
      case 'FLAGGED':
      case 'HIGH':
      case 'DELETED':
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      case 'PAUSED':
      case 'DRAFT':
      case 'RENTED':
      case 'CLOSED':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border',
        getStyle(),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status.replace(/_/g, ' ')}
    </span>
  );
}
