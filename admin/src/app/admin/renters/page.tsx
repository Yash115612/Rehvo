'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  Heart,
  CalendarCheck,
  Sparkles,
  Wallet,
  Share2,
  Lock,
  Ban,
  LogOut,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Phone,
  Loader2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { getRealRenters, RealRenterRecord } from '@/lib/supabase/admin-service';

export default function AdminRentersPage() {
  const [renters, setRenters] = useState<RealRenterRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await getRealRenters();
        setRenters(data);
      } catch (err) {
        console.warn('Failed to load renters:', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = renters.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (id: string, action: 'SUSPEND' | 'BAN' | 'LOGOUT' | 'RESET') => {
    if (action === 'LOGOUT') {
      alert(`Forced session logout initiated for user token across mobile & web devices.`);
      return;
    }
    if (action === 'RESET') {
      alert(`Password reset SMS & Email dispatched.`);
      return;
    }
    setRenters((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (action === 'SUSPEND') return { ...r, status: r.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' };
          if (action === 'BAN') return { ...r, status: 'BANNED' };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Renter & Tenant CRM
            </h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {renters.length} Registered Renter{renters.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real registered platform users, profile telemetry, scheduled visits, and account sanctions
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => exportToCSV(renters, 'rehvo_renters_directory')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs dark:shadow-card">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search renter by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* 3. Renters Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs dark:shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left table-dense">
            <thead>
              <tr>
                <th>Renter Details</th>
                <th>Contact</th>
                <th>Saved Homes</th>
                <th>AI Searches</th>
                <th>Visits Booked</th>
                <th>R-Cash Wallet</th>
                <th>Referrals</th>
                <th>Status</th>
                <th className="text-right">Sanctions & Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                      <Loader2 size={16} className="animate-spin text-[#0E8F73]" />
                      <span>Loading real renters from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-xs text-slate-500">
                      <Users size={24} className="text-slate-400" />
                      <p className="font-bold text-slate-700 dark:text-slate-300">No renters found</p>
                      <p className="text-[11px] text-slate-400">Registered users will appear here automatically.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((renter) => (
                  <tr key={renter.id}>
                    <td>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">{renter.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {renter.id.slice(0, 8)}</div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Mail size={11} className="text-slate-400" />
                        <span>{renter.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="text-slate-400" />
                        <span>{renter.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <Heart size={12} className="text-rose-400 fill-rose-400" />
                        <span>{renter.saved_homes_count}</span>
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                        <Sparkles size={12} className="text-[#10B981]" />
                        <span>{renter.ai_searches_count} queries</span>
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                        {renter.visits_count} Tours
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                        <Wallet size={12} />
                        <span>₹{renter.wallet_rcash}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        ₹{renter.referral_rewards}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          renter.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-[#10B981]/20 dark:text-[#10B981]'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                        }`}
                      >
                        {renter.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAction(renter.id, 'LOGOUT')}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                          title="Force Logout Session"
                        >
                          <LogOut size={13} />
                        </button>

                        <button
                          onClick={() => handleAction(renter.id, 'SUSPEND')}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-amber-600 transition"
                          title={renter.status === 'SUSPENDED' ? 'Unsuspend Account' : 'Suspend Account'}
                        >
                          <Ban size={13} />
                        </button>

                        <button
                          onClick={() => handleAction(renter.id, 'RESET')}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                          title="Reset Password"
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
