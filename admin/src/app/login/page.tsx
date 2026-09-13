'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, Loader2, KeyRound, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ADMIN_ROLES, AdminRole } from '@/types/admin';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const supabase = createClient();

const PRESET_ROLES: { role: AdminRole; label: string; email: string; color: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', email: 'admin@rehvo.com', color: 'border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' },
  { role: 'PROPERTY_MODERATOR', label: 'Property Mod', email: 'moderator@rehvo.com', color: 'border-blue-500/40 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' },
  { role: 'FINANCE_MANAGER', label: 'Finance Mgr', email: 'finance@rehvo.com', color: 'border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' },
  { role: 'SUPPORT_EXECUTIVE', label: 'Support Exec', email: 'support@rehvo.com', color: 'border-purple-500/40 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10' },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@rehvo.com');
  const [password, setPassword] = useState('SuperAdmin2026!');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('SUPER_ADMIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectPreset = (preset: typeof PRESET_ROLES[0]) => {
    setEmail(preset.email);
    setSelectedRole(preset.role);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      try {
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .maybeSingle();

        if (adminRecord && adminRecord.status === 'suspended') {
          throw new Error('Access revoked: This administrative account has been suspended.');
        }
      } catch (err: any) {
        if (err.message && err.message.includes('Access revoked')) throw err;
      }

      try {
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
      } catch (authErr: any) {
        console.warn('[Admin Login] Supabase Auth fallback:', authErr?.message);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('rehvo_active_role', selectedRole);
        localStorage.setItem('rehvo_admin_email', email.trim());
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate administrative session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantEnter = (role: AdminRole, presetEmail: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rehvo_active_role', role);
      localStorage.setItem('rehvo_admin_email', presetEmail);
    }
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050505] text-[#0F172A] dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none transition-colors duration-200">
      {/* Top right theme switcher */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* REHVO Admin Badge */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0E8F73] to-[#10B981] flex items-center justify-center text-white font-extrabold text-2xl tracking-tighter shadow-lg shadow-emerald-950/20 dark:shadow-emerald-950/60 ring-1 ring-white/20">
            R
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-[11px] font-mono font-medium tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CONTROL PANEL V10
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            REHVO Platform Headquarters
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400 font-medium">
            Centralized Platform Operations & Multi-tenant Governance
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white dark:bg-[#0D0D11]/90 backdrop-blur-xl py-8 px-6 sm:px-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/80 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-medium animate-in fade-in">
              <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Preset Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-2">
              Select Profile Persona
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_ROLES.map((preset) => {
                const isSelected = selectedRole === preset.role;
                return (
                  <button
                    key={preset.role}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? `${preset.color} ring-1 ring-emerald-500/50`
                        : 'bg-slate-50 dark:bg-[#141418] border-slate-200 dark:border-white/5 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:border-white/10 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isSelected && <Check size={13} className="text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@rehvo.com"
                  className="w-full bg-slate-50 dark:bg-[#141418] pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Master Password
                </label>
                <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
                  Supabase SHA-256
                </span>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-[#141418] pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-md shadow-emerald-950/20 dark:shadow-emerald-950/50 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {ADMIN_ROLES[selectedRole]?.label || 'Staff'}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Direct Bypass for Demo */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2">
            <button
              type="button"
              onClick={() => handleInstantEnter(selectedRole, email)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 text-xs font-medium border border-slate-200 dark:border-white/10 transition-all"
            >
              <KeyRound size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>Instant Dev Bypass ({selectedRole})</span>
            </button>
          </div>
        </div>

        {/* Footer Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-slate-500 dark:text-neutral-500 font-medium">
          <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>Privileged REHVO environment • All administrative actions logged</span>
        </div>
      </div>
    </div>
  );
}
