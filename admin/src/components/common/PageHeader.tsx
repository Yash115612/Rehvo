'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/5">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {badge && (
            <span
              className={`text-[11px] font-mono font-medium tracking-wide px-2 py-0.5 rounded-full border ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {(actions || children) && (
        <div className="flex items-center gap-2 flex-wrap">
          {actions}
          {children}
        </div>
      )}
    </div>
  );
}
