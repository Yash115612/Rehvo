import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'navy' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-rehvo-orange text-white hover:bg-rehvo-orange-hover active:bg-rehvo-orange-active shadow-xs border border-transparent',
  navy:
    'bg-rehvo-navy text-white hover:bg-rehvo-navy-secondary active:bg-rehvo-navy shadow-xs border border-transparent',
  secondary:
    'bg-white text-rehvo-navy border border-rehvo-border hover:bg-rehvo-surface-subtle hover:border-rehvo-border-focus',
  outline:
    'bg-transparent text-rehvo-navy border border-rehvo-navy hover:bg-rehvo-surface-subtle',
  ghost:
    'bg-transparent text-rehvo-navy hover:bg-rehvo-surface-muted border border-transparent',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-lg gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold tracking-tight transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rehvo-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && 'w-full',
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'secondary' | 'ghost' | 'navy';
  size?: 'sm' | 'md';
  label: string;
  children: React.ReactNode;
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rehvo-orange focus-visible:ring-offset-2 disabled:opacity-50',
        size === 'sm' ? 'h-9 w-9 min-h-[36px] min-w-[36px]' : 'h-11 w-11 min-h-[44px] min-w-[44px]',
        variant === 'ghost' && 'text-rehvo-navy hover:bg-rehvo-surface-muted',
        variant === 'secondary' && 'bg-white text-rehvo-navy border border-rehvo-border hover:bg-rehvo-surface-subtle',
        variant === 'navy' && 'bg-rehvo-navy text-white hover:bg-rehvo-navy-secondary',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
