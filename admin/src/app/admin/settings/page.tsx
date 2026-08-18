'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Save, ShieldCheck, Database, Bell, CheckCircle2, Loader2 } from 'lucide-react';
import { getSystemSettings, saveSystemSetting } from '@/lib/supabase/admin-service';

export default function AdminSettingsPage() {
  const [autoVerifyAadhaar, setAutoVerifyAadhaar] = useState(true);
  const [requireDeedBeforeActive, setRequireDeedBeforeActive] = useState(false);
  const [maxVisitsPerUser, setMaxVisitsPerUser] = useState(5);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getSystemSettings()
      .then((settings) => {
        if (settings.auto_verify_phone !== undefined) setAutoVerifyAadhaar(settings.auto_verify_phone);
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
        saveSystemSetting('auto_verify_phone', autoVerifyAadhaar, 'Auto verify phone OTP'),
        saveSystemSetting('require_deed_before_active', requireDeedBeforeActive, 'Enforce deed review before listing active'),
        saveSystemSetting('max_visits_per_user', maxVisitsPerUser, 'Max scheduled visits per user limit'),
        saveSystemSetting('maintenance_mode', maintenanceMode, 'Platform global maintenance flag'),
      ]);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save system settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform & System Settings"
        subtitle="Configure platform governance rules, verification policies, and infrastructure toggles"
      />

      <div className="max-w-3xl bg-white rounded-xl border border-brand-border p-6 shadow-xs">
        {savedSuccess && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Operational settings saved to Supabase & logged to audit trail!</span>
          </div>
        )}

        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading system settings...</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 divide-y divide-brand-border">
            {/* Section 1: Verification Policies */}
            <div className="space-y-4 pt-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-brand-primary" />
                <span>Verification Policies</span>
              </h3>

              <div className="flex items-center justify-between p-3 rounded-lg bg-brand-canvas/60 border border-brand-border">
                <div>
                  <p className="text-xs font-bold text-brand-dark">Instant Phone OTP Verification</p>
                  <p className="text-[11.5px] text-brand-muted">Automatically mark phone verified upon SMS OTP completion.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoVerifyAadhaar}
                  onChange={(e) => setAutoVerifyAadhaar(e.target.checked)}
                  className="w-4 h-4 text-brand-primary rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-brand-canvas/60 border border-brand-border">
                <div>
                  <p className="text-xs font-bold text-brand-dark">Enforce Deed Verification for Renter Search</p>
                  <p className="text-[11.5px] text-brand-muted">Hide listings from general renter search until admin verifies deed.</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireDeedBeforeActive}
                  onChange={(e) => setRequireDeedBeforeActive(e.target.checked)}
                  className="w-4 h-4 text-brand-primary rounded"
                />
              </div>
            </div>

            {/* Section 2: Platform Limits */}
            <div className="space-y-4 pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
                <Database size={16} className="text-brand-primary" />
                <span>Throughput & Limits</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-brand-dark mb-1">
                  Max Concurrent Scheduled Visits Per Renter
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={maxVisitsPerUser}
                  onChange={(e) => setMaxVisitsPerUser(Number(e.target.value))}
                  className="w-40 bg-brand-canvas px-3 py-1.5 rounded-lg border border-brand-border text-xs text-brand-dark font-bold focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Section 3: Maintenance */}
            <div className="space-y-4 pt-5">
              <div className="flex items-center justify-between p-3 rounded-lg bg-rose-50 border border-rose-200">
                <div>
                  <p className="text-xs font-bold text-rose-900">Platform Maintenance Mode</p>
                  <p className="text-[11.5px] text-rose-700">Display maintenance screen across the mobile application.</p>
                </div>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
              </div>
            </div>

            <div className="pt-5">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-dark hover:bg-brand-primary text-white text-xs font-bold rounded-lg transition-colors shadow-xs disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>Save System Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
