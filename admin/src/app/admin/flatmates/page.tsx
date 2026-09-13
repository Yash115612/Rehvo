'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Download,
  CheckCircle2,
  PauseCircle,
  MapPin,
  IndianRupee,
  Briefcase,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { getFlatmates, updateFlatmateStatus, AdminFlatmateRecord } from '@/lib/supabase/admin-service';

export default function AdminFlatmatesPage() {
  const [flatmates, setFlatmates] = useState<AdminFlatmateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data } = await getFlatmates();
      setFlatmates(data || []);
    } catch (err) {
      console.warn('Failed to load flatmates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = flatmates.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.occupation || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.location || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    const res = await updateFlatmateStatus(id, nextStatus as any);
    if (res.success) {
      setFlatmates((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: nextStatus as any } : f))
      );
    } else {
      alert(res.error || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Flatmates & Roommate Requests
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {flatmates.length} Real Records
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time flatmate profiles, preferences, verified occupational backgrounds, and locality matches from Supabase
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => exportToCSV(flatmates, 'rehvo_flatmate_profiles')}
            disabled={flatmates.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by seeker name, profession, locality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 font-semibold px-3 py-2 rounded-xl focus:outline-none focus:border-[#10B981]"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="DRAFT">Draft</option>
        </select>
      </div>

      {/* 3. Content */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-3" size={28} />
          <p className="text-xs text-slate-500 font-medium">Querying Supabase flatmate database...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <Users size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {flatmates.length === 0 ? '0 Flatmate Seeker Profiles in Database' : 'No Profiles Match Your Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {flatmates.length === 0
              ? 'Zero mock data is enabled. Roommate and flatmate seeker requests submitted by verified users in the mobile app will automatically populate here.'
              : 'Try clearing your search query or switching the status filter to All.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((seeker) => (
            <div
              key={seeker.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#10B981]/40 transition"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 font-black text-sm">
                  {seeker.name?.charAt(0) || 'F'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{seeker.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                      {seeker.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <Briefcase size={12} className="shrink-0" />
                    <span className="truncate">{seeker.occupation}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <MapPin size={11} className="shrink-0" />
                    <span className="truncate">{seeker.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Budget</span>
                  <p className="text-xs font-black text-slate-900 dark:text-white">{formatCurrency(seeker.budget)}/mo</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Preference</span>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{seeker.room_preference}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  {formatDate(seeker.created_at)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(seeker.id, seeker.status)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      seeker.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-amber-50 hover:text-amber-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-amber-500/10'
                        : 'bg-amber-50 text-amber-700 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-emerald-500/10'
                    }`}
                  >
                    {seeker.status === 'ACTIVE' ? (
                      <>
                        <CheckCircle2 size={13} />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <PauseCircle size={13} />
                        <span>Paused</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
