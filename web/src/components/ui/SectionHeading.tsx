import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  actionLabel,
  actionHref,
  align = 'left',
  theme = 'light',
  className,
}: SectionHeadingProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center'
          ? 'items-center text-center'
          : 'md:flex-row md:items-end md:justify-between',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p
            className={cn(
              'mb-2 text-xs font-bold uppercase tracking-widest',
              isDark ? 'text-rehvo-orange' : 'text-rehvo-orange-active'
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            'text-2xl font-bold tracking-tight sm:text-3xl lg:text-[2rem] lg:leading-[1.2]',
            isDark ? 'text-white' : 'text-rehvo-navy'
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              'mt-2.5 text-base leading-relaxed',
              isDark ? 'text-slate-300' : 'text-rehvo-secondary'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className={cn(
            'inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors',
            isDark
              ? 'text-white hover:text-rehvo-orange'
              : 'text-rehvo-navy hover:text-rehvo-orange-hover'
          )}
        >
          <span>{actionLabel}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
