'use client';

import React, { useState } from 'react';
import {
  Shield,
  Check,
  X,
  Save,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import {
  AdminRole,
  ADMIN_ROLE_LABELS,
  ADMIN_ROLE_COLORS,
  ROLE_DEFAULT_PERMISSIONS,
} from '@/lib/auth/admin-auth';
import { PermissionModule, RolePermissionConfig } from '@/types/rbac';

export default function AdminRbacPage() {
  const [selectedRole, setSelectedRole] = useState<AdminRole>('PROPERTY_MODERATOR');
  const [permissions, setPermissions] = useState<Record<AdminRole, RolePermissionConfig>>(
    ROLE_DEFAULT_PERMISSIONS
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const modulesList: { key: PermissionModule; label: string; desc: string }[] = [
    { key: 'dashboard', label: 'Dashboard & Metrics', desc: 'Access operational overview & live KPI cards' },
    { key: 'properties', label: 'Properties Inventory', desc: 'View residential and commercial property CRM' },
    { key: 'property_edit', label: 'Property Edit Suite', desc: 'Modify rates, descriptions, amenities, and GPS' },
    { key: 'property_approval', label: 'Property Approval', desc: 'Publish, pause, or approve pending listings' },
    { key: 'property_delete', label: 'Property Deletion', desc: 'Soft delete or permanently remove listings' },
    { key: 'users', label: 'User Directory', desc: 'View renter accounts and contact details' },
    { key: 'owners', label: 'Owner CRM', desc: 'Manage verified landlords and impersonate login' },
    { key: 'flatmates', label: 'Flatmates VibeMatch', desc: 'Moderate roommate profiles, bio, and lifestyle tags' },
    { key: 'pg_hostels', label: 'PG & Hostels', desc: 'Manage bed inventory and meal packages' },
    { key: 'commercial', label: 'Commercial Listings', desc: 'Manage offices, retail shops, and warehouses' },
    { key: 'society', label: 'Society Services', desc: 'Onboard housing societies and RWA gate passes' },
    { key: 'payments', label: 'Payments & Revenue', desc: 'View financial transactions and invoices' },
    { key: 'refunds', label: 'Refund Processing', desc: 'Issue deposit and booking fee refunds' },
    { key: 'kyc', label: 'KYC & Title Deeds', desc: 'Review ownership deeds, bills, and identity proofs' },
    { key: 'chats', label: 'Chat Moderation', desc: 'Monitor tenant-owner conversations and spam' },
    { key: 'visits', label: 'Physical Visits', desc: 'Schedule walkthroughs and assign field executives' },
    { key: 'showreels', label: 'ShowReels Video CMS', desc: 'Upload, schedule, and feature video showreels' },
    { key: 'cms', label: 'Website CMS Builder', desc: 'Edit homepage hero, search bar, FAQs, and blogs' },
    { key: 'notifications', label: 'Notification Broadcast', desc: 'Dispatch push, SMS, and WhatsApp campaigns' },
    { key: 'ai', label: 'AI Concierge Center', desc: 'Configure system prompts and knowledge base' },
    { key: 'support', label: 'Support Ticket Desk', desc: 'Assign and resolve customer support tickets' },
    { key: 'analytics', label: 'Analytics Center', desc: 'Deep-dive into funnels and conversion metrics' },
    { key: 'staff', label: 'Staff Management', desc: 'Provision employee accounts and view attendance' },
    { key: 'security', label: 'Security & Audit Logs', desc: 'View immutable audit trail and login history' },
    { key: 'settings', label: 'Platform Governance', desc: 'Manage global policies and maintenance mode' },
  ];

  const currentConfig = permissions[selectedRole] || ROLE_DEFAULT_PERMISSIONS.SUPER_ADMIN;

  const togglePermission = (mod: PermissionModule, type: 'view' | 'edit' | 'approve' | 'delete' | 'export') => {
    if (selectedRole === 'SUPER_ADMIN') return; // Super admin has permanent unrestricted access

    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [mod]: {
          ...prev[selectedRole][mod],
          [type]: !prev[selectedRole][mod]?.[type],
        },
      },
    }));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Role-Based Access Control (RBAC) Matrix
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              Enterprise Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure granular permissions per staff role with individual toggle switches across all operational modules
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0E8F73] hover:bg-[#10B981] text-xs font-extrabold text-white shadow-glow transition cursor-pointer"
          >
            <Save size={14} />
            <span>Save RBAC Matrix</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>RBAC permission policies saved and propagated to staff session tokens!</span>
        </div>
      )}

      {/* 2. Role Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
        {(Object.keys(ADMIN_ROLE_LABELS) as AdminRole[]).map((r) => {
          const isSelected = r === selectedRole;
          return (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
              }`}
            >
              <span>{ADMIN_ROLE_LABELS[r]}</span>
              {r === 'SUPER_ADMIN' && <Lock size={11} className="text-slate-400" />}
            </button>
          );
        })}
      </div>

      {/* Notice for Super Admin */}
      {selectedRole === 'SUPER_ADMIN' && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-[#10B981]/10 border border-emerald-200 dark:border-[#10B981]/20 flex items-center gap-2 text-xs text-emerald-800 dark:text-[#10B981] font-bold">
          <Shield size={16} />
          <span>Super Admin holds immutable unrestricted master privileges across all platform operations.</span>
        </div>
      )}

      {/* 3. Granular Matrix Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs dark:shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-dense">
            <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-600 dark:text-slate-400">
              <tr>
                <th>Module / Feature</th>
                <th className="text-center w-28">View Access</th>
                <th className="text-center w-28">Edit Access</th>
                <th className="text-center w-28">Approval</th>
                <th className="text-center w-28">Delete</th>
                <th className="text-center w-28">Export CSV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {modulesList.map((m) => {
                const p = currentConfig[m.key] || { view: false };
                return (
                  <tr key={m.key} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                    <td>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{m.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{m.desc}</div>
                    </td>

                    {/* View Switch */}
                    <td className="text-center">
                      <button
                        onClick={() => togglePermission(m.key, 'view')}
                        disabled={selectedRole === 'SUPER_ADMIN'}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          p.view ? 'bg-[#0E8F73]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            p.view ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Edit Switch */}
                    <td className="text-center">
                      <button
                        onClick={() => togglePermission(m.key, 'edit')}
                        disabled={selectedRole === 'SUPER_ADMIN'}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          p.edit ? 'bg-[#0E8F73]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            p.edit ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Approve Switch */}
                    <td className="text-center">
                      <button
                        onClick={() => togglePermission(m.key, 'approve')}
                        disabled={selectedRole === 'SUPER_ADMIN'}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          p.approve ? 'bg-[#0E8F73]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            p.approve ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Delete Switch */}
                    <td className="text-center">
                      <button
                        onClick={() => togglePermission(m.key, 'delete')}
                        disabled={selectedRole === 'SUPER_ADMIN'}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          p.delete ? 'bg-[#0E8F73]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            p.delete ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Export Switch */}
                    <td className="text-center">
                      <button
                        onClick={() => togglePermission(m.key, 'export')}
                        disabled={selectedRole === 'SUPER_ADMIN'}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                          p.export ? 'bg-[#0E8F73]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            p.export ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
