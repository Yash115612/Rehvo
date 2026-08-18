'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ShieldAlert, CheckCircle2, XCircle, MoreHorizontal, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getReports, resolveReport } from '@/lib/supabase/admin-service';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.warn('[Admin Reports] Failed to load:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleAction = async (id: string, newStatus: 'RESOLVED' | 'DISMISSED') => {
    const notes = window.prompt(`Enter resolution notes for marking this report as ${newStatus}:`);
    setActionLoading(true);
    try {
      const res = await resolveReport(id, newStatus, notes || undefined);
      if (res.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus.toLowerCase() } : r))
        );
      } else {
        alert(res.error || 'Failed to update report status.');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const openReportsCount = reports.filter((r) => r.status === 'pending' || r.status === 'under_review').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safety & Moderation Reports"
        subtitle="Review community flags, pricing discrepancies, and platform safety violations"
        badge={`${openReportsCount} Open Reports`}
        badgeColor="bg-rose-100 text-rose-800 border-rose-200"
      />

      <div className="bg-white rounded-xl border border-brand-border overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-12 text-center flex items-center justify-center gap-2 text-xs text-brand-muted">
            <Loader2 size={16} className="animate-spin text-brand-primary" />
            <span>Loading safety reports from Supabase...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-xs">
            <p className="font-semibold text-brand-dark mb-1">No reports</p>
            <p>No safety reports currently pending review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-dense">
              <thead>
                <tr>
                  <th>Reported Target</th>
                  <th>Violation Category</th>
                  <th>Reporter Details</th>
                  <th>Status</th>
                  <th>Reported On</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="font-bold text-brand-dark">{r.properties?.title || 'Reported Entity'}</div>
                      <div className="text-[11px] text-brand-muted font-mono">{r.id.slice(0, 8)}...</div>
                      {r.description && (
                        <p className="text-[11.5px] text-brand-dark/80 mt-1 max-w-sm italic">
                          "{r.description}"
                        </p>
                      )}
                    </td>
                    <td>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-canvas text-brand-dark border border-brand-border">
                        {(r.reason || 'GENERAL').replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-brand-dark">{r.reporter?.full_name || 'Anonymous User'}</div>
                      <div className="text-[11px] text-brand-muted">{r.reporter?.phone || 'N/A'}</div>
                    </td>
                    <td>
                      <StatusBadge status={(r.status || 'PENDING').toUpperCase()} />
                    </td>
                    <td className="text-xs text-brand-muted">{formatDate(r.created_at)}</td>
                    <td className="text-right">
                      {r.status === 'pending' || r.status === 'under_review' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(r.id, 'RESOLVED')}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleAction(r.id, 'DISMISSED')}
                            disabled={actionLoading}
                            className="px-2.5 py-1 rounded bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold shadow-2xs transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-brand-muted">Handled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
