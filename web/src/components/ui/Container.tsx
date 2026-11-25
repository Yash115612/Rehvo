import React from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide';
  children: React.ReactNode;
}

export function Container({
  size = 'default',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        size === 'narrow' && 'max-w-[960px]',
        size === 'default' && 'max-w-[1280px]',
        size === 'wide' && 'max-w-[1440px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
