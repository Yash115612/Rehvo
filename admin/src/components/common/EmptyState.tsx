'use client';

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-brand-border p-12 text-center max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-2xl bg-brand-canvas border border-brand-border flex items-center justify-center mx-auto text-brand-muted mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-bold text-brand-dark">{title}</h3>
      <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
