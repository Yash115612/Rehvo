'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  ShieldCheck,
  Database,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Lock,
} from 'lucide-react';
import { getSystemSettings, saveSystemSetting } from '@/lib/supabase/admin-service';

export default function AdminSettingsPage() {
  const [autoVerifyPhone, setAutoVerifyPhone] = useState(true);
  const [requireDeedBeforeActive, setRequireDeedBeforeActive] = useState(true);
  const [maxVisitsPerUser, setMaxVisitsPerUser] = useState(5);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getSystemSettings()
      .then((settings) => {
        if (settings.auto_verify_phone !== undefined) setAutoVerifyPhone(settings.auto_verify_phone);
        if (settings.require_deed_before_active !== undefined) setRequireDeedBeforeActive(settings.require_deed_before_active);
        if (settings.max_visits_per_user !== undefined) setMaxVisitsPerUser(Number(settings.max_visits_per_user));
        if (settings.maintenance_mode !== undefined) setMaintenanceMode(settings.maintenance_mode);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        saveSystemSetting('auto_verify_phone', autoVerifyPhone, 'Auto verify phone OTP'),
        saveSystemSetting('require_deed_before_active', requireDeedBeforeActive, 'Enforce deed review before listing active'),
        saveSystemSetting('max_visits_per_user', maxVisitsPerUser, 'Max scheduled visits per user limit'),
        saveSystemSetting('maintenance_mode', maintenanceMode, 'Platform global maintenance flag'),
      ]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform & Governance Settings
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              Production Environment
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure platform policies, verification prerequisites, visit booking thresholds, and emergency maintenance toggles
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Operational settings saved to Supabase & logged to immutable audit trail!</span>
        </div>
      )}

      {/* 2. Settings Form */}
      <div className="max-w-3xl rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 p-6 shadow-xs dark:shadow-card">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 size={16} className="animate-spin text-[#0E8F73]" />
            <span>Loading system settings from database...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 divide-y divide-slate-100 dark:divide-white/10">
            {/* Section 1: Verification Policies */}
            <div className="space-y-4 pt-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#0E8F73] dark:text-[#10B981]" />
                <span>Verification Prerequisites</span>
              </h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Instant Phone OTP Verification</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Auto-verify users upon completing 6-digit SMS OTP challenge.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoVerifyPhone(!autoVerifyPhone)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    autoVerifyPhone ? 'bg-[#0E8F73]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      autoVerifyPhone ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Mandatory Deed Review Before Listing Activation</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Require human admin review of ownership deed (Index-II) before property becomes searchable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireDeedBeforeActive(!requireDeedBeforeActive)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    requireDeedBeforeActive ? 'bg-[#0E8F73]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      requireDeedBeforeActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Section 2: Walkthrough Limits */}
            <div className="space-y-4 pt-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Visit & Tour Quotas
              </h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Maximum Concurrent Visits Per Tenant</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Prevents booking spam and agent availability contention.</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxVisitsPerUser}
                  onChange={(e) => setMaxVisitsPerUser(Number(e.target.value))}
                  className="w-20 bg-slate-100 dark:bg-[#16161A] text-center font-bold text-xs text-slate-900 dark:text-white py-1.5 rounded-lg border border-slate-200 dark:border-white/10 focus:outline-none focus:border-[#0E8F73]"
                />
              </div>
            </div>

            {/* Section 3: Emergency Mode */}
            <div className="space-y-4 pt-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>Emergency Operations</span>
              </h3>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                <div>
                  <p className="text-xs font-bold text-rose-800 dark:text-rose-300">Global Maintenance Mode</p>
                  <p className="text-[11px] text-rose-600 dark:text-slate-400">Display maintenance screen across website and mobile apps.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${
                    maintenanceMode ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      maintenanceMode ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-5 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-extrabold text-white flex items-center gap-2 shadow-glow transition disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Platform Settings</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
