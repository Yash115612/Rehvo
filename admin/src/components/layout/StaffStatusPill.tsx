'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import {
  AdminRole,
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_COLORS,
  getActiveAdminRole,
  setActiveAdminRole,
  getActiveAdminUser,
} from '@/lib/auth/admin-auth';

export function StaffStatusPill() {
  const [role, setRole] = useState<AdminRole>('SUPER_ADMIN');
  const [isOnline, setIsOnline] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(14520); // ~4 hours
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setRole(getActiveAdminRole());
    const handleRoleChange = (e: any) => {
      setRole(e.detail?.role || 'SUPER_ADMIN');
    };
    window.addEventListener('rehvo-admin-role-change', handleRoleChange);
    return () => window.removeEventListener('rehvo-admin-role-change', handleRoleChange);
  }, []);

  // Live timer tick
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      setShiftSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnline]);

  const formatShiftTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const currentUser = getActiveAdminUser();
  const roleStyle = ADMIN_ROLE_COLORS[role];

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
        {/* Online / Shift Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          title={isOnline ? 'Click to go Offline / Break' : 'Click to Clock In'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 dark:bg-black/40 dark:hover:bg-black/60 border border-slate-200/80 dark:border-transparent shadow-2xs transition cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]' : 'bg-slate-400'
            }`}
          />
          <span className="text-[11px] font-bold text-slate-800 dark:text-white">
            {isOnline ? 'Online' : 'Offline'}
          </span>
          {isOnline && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-0.5 ml-1">
              <Clock size={10} className="text-slate-400" />
              {formatShiftTime(shiftSeconds)}
            </span>
          )}
        </button>

        {/* Role Pill Switcher */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition cursor-pointer"
          style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, border: `1px solid ${roleStyle.border}` }}
        >
          <span>{ADMIN_ROLE_LABELS[role]}</span>
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Role Switcher Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-64 bg-white dark:bg-[#0F0F12] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 border-b border-slate-200 dark:border-white/5 mb-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Simulate Staff Role / RBAC
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Active: <span className="font-bold text-slate-900 dark:text-white">{currentUser.full_name}</span>
            </p>
          </div>

          <div className="space-y-0.5 max-h-60 overflow-y-auto">
            {(Object.keys(ADMIN_ROLE_LABELS) as AdminRole[]).map((r) => {
              const isSelected = r === role;
              return (
                <button
                  key={r}
                  onClick={() => {
                    setActiveAdminRole(r);
                    setRole(r);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left transition ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 dark:bg-[#10B981]/20 dark:text-[#10B981] dark:border-transparent'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{ADMIN_ROLE_LABELS[r]}</span>
                  {isSelected && <CheckCircle2 size={13} className="text-[#0E8F73] dark:text-[#10B981] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
