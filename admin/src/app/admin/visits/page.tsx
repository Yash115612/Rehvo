'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  Download,
  Building2,
  Clock,
  MapPin,
  CheckCircle2,
  UserCheck,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { getVisits } from '@/lib/supabase/admin-service';

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getVisits();
      setVisits(data || []);
    } catch (err) {
      console.warn('Failed to load visits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = visits.filter((v) => {
    const propertyTitle = v.property_title || v.properties?.title || '';
    const renterName = v.renter_name || v.renter?.full_name || '';
    const ownerName = v.owner_name || v.owner?.full_name || '';
    const matchesSearch =
      propertyTitle.toLowerCase().includes(search.toLowerCase()) ||
      renterName.toLowerCase().includes(search.toLowerCase()) ||
      ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || (v.status || '').toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Physical Walkthroughs & Visits
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {visits.length} Scheduled Tours
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Coordinate in-person property tours, field executive assignments, visit OTPs, and GPS check-ins
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
            onClick={() => exportToCSV(visits, 'rehvo_visits_schedule')}
            disabled={visits.length === 0}
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
            placeholder="Search visit by property, renter, or owner..."
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
          <option value="ALL">All Visit Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* 3. Table or Empty State */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-3" size={28} />
          <p className="text-xs text-slate-500 font-medium">Querying real tour bookings from Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <CalendarCheck size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {visits.length === 0 ? '0 Physical Tours Scheduled in Database' : 'No Visits Match Your Filter'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {visits.length === 0
              ? 'Zero mock data is enabled. In-person walkthrough requests booked by prospective tenants via the REHVO app will be listed here with OTP confirmation and GPS status.'
              : 'Try clearing your search query or switching the status filter.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Property</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Renter</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Owner</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Date & Time</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Executive</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Verification</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px] text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {v.property_title || v.properties?.title || 'Listing Walkthrough'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#10B981] shrink-0" />
                        <span className="truncate">{v.property_locality || v.properties?.locality || 'Mumbai'}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{v.renter_name || v.renter?.full_name || 'Renter'}</div>
                      <div className="text-[11px] text-slate-400">{v.renter_phone || v.renter?.phone || '—'}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-700 dark:text-slate-300">{v.owner_name || v.owner?.full_name || 'Owner'}</div>
                      <div className="text-[11px] text-slate-400">{v.owner_phone || v.owner?.phone || '—'}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Clock size={12} className="text-[#10B981]" />
                        <span>{v.scheduled_date || 'TBD'} {v.scheduled_time ? `at ${v.scheduled_time}` : ''}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                        <UserCheck size={12} className="text-blue-500" />
                        <span>{v.assigned_executive_name || 'Unassigned'}</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                            v.otp_verified ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400'
                          }`}
                        >
                          {v.otp_verified ? 'OTP Verified' : 'OTP Pending'}
                        </span>
                        <span
                          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
                            v.gps_checked_in ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-500/20 dark:text-slate-400'
                          }`}
                        >
                          {v.gps_checked_in ? 'GPS Match' : 'No GPS'}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          v.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-[#10B981]/20 dark:text-[#10B981]'
                            : v.status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                        }`}
                      >
                        {v.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <select
                        value={v.status || 'PENDING'}
                        onChange={(e: any) => handleStatusChange(v.id, e.target.value)}
                        className="bg-slate-50 dark:bg-[#16161A] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white px-2 py-1 rounded-lg focus:outline-none focus:border-[#10B981]"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirm</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancel</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
