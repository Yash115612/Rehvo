import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leadingIcon, className, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-rehvo-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leadingIcon && (
            <span className="pointer-events-none absolute left-3.5 text-rehvo-muted">
              {leadingIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'h-11 w-full rounded-xl border border-rehvo-border bg-white px-3.5 text-sm font-medium text-rehvo-navy placeholder:text-rehvo-muted transition-colors focus:border-rehvo-navy focus:outline-none focus:ring-2 focus:ring-rehvo-navy/10 disabled:bg-rehvo-surface-muted',
              leadingIcon && 'pl-10',
              error && 'border-rehvo-error focus:border-rehvo-error focus:ring-rehvo-error/10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs font-medium text-rehvo-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leadingIcon'> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onClear, className, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-rehvo-muted" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'h-11 w-full rounded-xl border border-rehvo-border bg-white pl-10 pr-9 text-sm font-medium text-rehvo-navy placeholder:text-rehvo-muted transition-colors focus:border-rehvo-navy focus:outline-none focus:ring-2 focus:ring-rehvo-navy/10',
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2.5 flex h-7 w-7 items-center justify-center rounded-lg text-rehvo-muted hover:bg-rehvo-surface-muted hover:text-rehvo-navy"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, id, children, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-rehvo-secondary"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-11 w-full rounded-xl border border-rehvo-border bg-white px-3.5 text-sm font-medium text-rehvo-navy transition-colors focus:border-rehvo-navy focus:outline-none focus:ring-2 focus:ring-rehvo-navy/10',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';
