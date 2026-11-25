import React from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'navy' | 'orange' | 'neutral' | 'success' | 'outline';

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  navy: 'bg-rehvo-navy text-white border border-rehvo-navy',
  orange: 'bg-rehvo-orange-soft text-rehvo-orange-active border border-rehvo-orange-border',
  neutral: 'bg-rehvo-surface-muted text-rehvo-navy border border-rehvo-border',
  success: 'bg-rehvo-success-soft text-rehvo-success border border-emerald-200',
  outline: 'bg-white text-rehvo-navy border border-rehvo-border',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({
  variant = 'neutral',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-tight whitespace-nowrap',
        BADGE_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
