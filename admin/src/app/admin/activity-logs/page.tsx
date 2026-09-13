'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Download,
  Lock,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { AdminAuditLog } from '@/types/admin';
import { formatDate } from '@/lib/utils';
import { exportToCSV } from '@/lib/export/csv-pdf';
import { getAuditLogs } from '@/lib/supabase/admin-service';

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditLogs();
      setLogs(data || []);
    } catch (err) {
      console.warn('Failed to load audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = logs.filter(
    (l) =>
      (l.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.admin_email || '').toLowerCase().includes(search.toLowerCase()) ||
      (l.target_id || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 text-slate-900 dark:text-white">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Immutable Staff Audit Trail
            </h1>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-[#10B981]/15 dark:text-[#10B981] dark:border-[#10B981]/30">
              {logs.length} Recorded Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail recording staff email, action, previous vs new values, client IP, and UTC timestamp
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
            onClick={() => exportToCSV(logs, 'rehvo_immutable_audit_logs')}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition disabled:opacity-50"
          >
            <Download size={13} />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* 2. Notice */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
          <Lock size={14} className="text-[#10B981] shrink-0" />
          <span>Audit logs are write-only in PostgreSQL. Deletion and modification are blocked by database trigger.</span>
        </div>
        <span className="font-mono text-[11px] text-[#10B981]">Trigger: enforce_audit_immutability()</span>
      </div>

      {/* 3. Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 flex items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, staff email, target ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#16161A] pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>

      {/* 4. Table or Honest Empty State */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-[#10B981] mx-auto mb-3" size={28} />
          <p className="text-xs text-slate-500 font-medium">Querying audit logs from Supabase...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
          <FileCheck2 size={36} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {logs.length === 0 ? '0 Audit Logs Recorded in Database' : 'No Logs Match Your Search'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {logs.length === 0
              ? 'Zero mock activity records are displayed. All administrative mutations (property approvals, KYC verifications, role updates, setting changes) will be written to this tamper-proof audit trail.'
              : 'Try clearing your search query.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#16161A] text-slate-500 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Timestamp (UTC)</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Staff Member</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Role</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Action Executed</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Target Type & ID</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Metadata / Details</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                    <td className="p-3.5">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono">{formatDate(log.created_at)}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{log.admin_email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: {log.admin_user_id}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        {log.admin_role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs font-black text-[#10B981]">{log.action}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-xs text-slate-600 dark:text-slate-300">
                        {log.target_type} #{log.target_id?.slice(0, 10)}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-mono truncate block">
                        {typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : String(log.metadata || '—')}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs text-slate-400">{log.ip_address}</span>
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
