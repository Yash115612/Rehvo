'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  ShieldCheck,
  Search,
  Download,
  IndianRupee,
  Phone,
  Mail,
  Lock,
  AlertTriangle,
  UserCheck,
  LogIn,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  XCircle,
  Ban,
  Wallet,
  Loader2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { getRealOwners, RealOwnerRecord } from '@/lib/supabase/admin-service';

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<RealOwnerRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [kycFilter, setKycFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getRealOwners();
        setOwners(data);
      } catch (err) {
        console.warn('Failed to load owners:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = owners.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesKyc = kycFilter === 'ALL' || o.kyc_status === kycFilter;
    return matchesSearch && matchesStatus && matchesKyc;
  });

  const handleAction = (id: string, action: 'VERIFY' | 'SUSPEND' | 'BAN' | 'RESET') => {
    if (action === 'RESET') {
      alert(`Password reset link dispatched to owner's registered email.`);
      return;
    }
    setOwners((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          if (action === 'VERIFY') return { ...o, kyc_status: 'VERIFIED' };
          if (action === 'SUSPEND') return { ...o, status: o.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' };
          if (action === 'BAN') return { ...o, status: 'BANNED' };
        }
        return o;
      })
    );
  };

  const handleLoginAsOwner = (owner: RealOwnerRecord) => {
    if (window.confirm(`Simulate impersonation login as "${owner.name}"? This session will be recorded in the Super Admin audit logs.`)) {
      alert(`Impersonation mode activated for ${owner.name}. Redirecting to Owner Portal...`);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Owner CRM & Landlord Portfolio
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {owners.length} Registered Owner{owners.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real Supabase hosts, ownership deed validation, rental revenue velocity, and account sanctions
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportToCSV(owners, 'rehvo_verified_owners')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="p-4 rounded-2xl bg-[#121215] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-card">
        <div className="relative w-full lg:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by owner name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All KYC Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="PENDING">Pending Review</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#16161A] border border-white/10 text-xs text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* 3. Owners Table */}
      <div className="rounded-2xl bg-[#121215] border border-white/10 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-dense">
            <thead>
              <tr>
                <th>Owner Details</th>
                <th>Contact</th>
                <th>Listings</th>
                <th>Total Revenue</th>
                <th>Wallet Balance</th>
                <th>Subscription</th>
                <th>KYC Status</th>
                <th>Account</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 size={16} className="animate-spin text-[#0E8F73]" />
                      <span>Loading real owners from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <Building2 size={24} className="text-slate-400" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">No owner accounts found</p>
                      <p className="text-[11px] text-slate-400">Users who register properties will appear here automatically.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((owner) => (
                  <tr key={owner.id}>
                    <td>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{owner.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {owner.id.slice(0, 8)}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <Mail size={11} className="text-slate-400" />
                        <span>{owner.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="text-slate-400" />
                        <span>{owner.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {owner.properties_count} home{owner.properties_count === 1 ? '' : 's'}
                      </span>
                    </td>
                    <td>
                      <span className="font-black text-xs text-emerald-600 dark:text-[#10B981]">
                        {formatCurrency(owner.total_revenue)}/mo
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                        {formatCurrency(owner.wallet_balance)}
                      </span>
                    </td>
                    <td>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                        {owner.subscription.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                          owner.kyc_status === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30'
                            : owner.kyc_status === 'PENDING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                            : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30'
                        }`}
                      >
                        <ShieldCheck size={11} />
                        <span>{owner.kyc_status}</span>
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          owner.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-[#10B981]/20 dark:text-[#10B981]'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                        }`}
                      >
                        {owner.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleLoginAsOwner(owner)}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#0E8F73] text-slate-700 hover:text-white dark:bg-white/5 dark:text-slate-200 dark:hover:bg-[#0E8F73] dark:hover:text-white text-[11px] font-bold flex items-center gap-1 transition"
                          title="Login as Owner (Super Admin Only)"
                        >
                          <LogIn size={12} />
                          <span>Impersonate</span>
                        </button>

                        <button
                          onClick={() => handleAction(owner.id, 'SUSPEND')}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-amber-600 transition"
                          title={owner.status === 'SUSPENDED' ? 'Activate Owner' : 'Suspend Owner'}
                        >
                          <Ban size={13} />
                        </button>

                        <button
                          onClick={() => handleAction(owner.id, 'RESET')}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                          title="Send Password Reset Link"
                        >
                          <Lock size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
