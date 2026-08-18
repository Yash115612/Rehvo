'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-brand-primary-light text-brand-primary border-brand-primary/20',
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-brand-border/60">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-extrabold text-brand-dark tracking-tight">
            {title}
          </h1>
          {badge && (
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[12.5px] text-brand-muted mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}
