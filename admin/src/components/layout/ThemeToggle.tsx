'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
        theme === 'dark'
          ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10 hover:text-amber-300'
          : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-xs'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle platform color theme"
    >
      {theme === 'dark' ? (
        <>
          <Sun size={14} className="text-amber-400" />
          <span className="hidden sm:inline text-[11px] font-medium text-slate-300">Light</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-indigo-600" />
          <span className="hidden sm:inline text-[11px] font-medium text-slate-700">Dark</span>
        </>
      )}
    </button>
  );
}
